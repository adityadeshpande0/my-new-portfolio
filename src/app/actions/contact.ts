"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactSchema, type ContactState } from "@/lib/contactSchema";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
// Best-effort, per-instance limiter. Swap for a shared store (e.g. Upstash) if abuse appears.
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never see or fill this field. Pretend success for bots.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success", message: "Thanks — message received." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof raw;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors, values: raw };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "You've sent a few messages already — please try again in a little while.",
      values: raw,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not configured.");
    return {
      status: "error",
      message: "The contact form isn't configured yet — please email me directly instead.",
      values: raw,
    };
  }

  const { name, email, message } = parsed.data;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio — new message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
      html: `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><p>— ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[contact] send failed", err);
    return {
      status: "error",
      message: "Something went wrong sending that. Please try again or email me.",
      values: raw,
    };
  }

  return { status: "success", message: "Thanks — your message is on its way. I'll reply soon." };
}
