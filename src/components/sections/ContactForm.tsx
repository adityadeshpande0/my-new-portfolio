"use client";

import { AnimatePresence, m } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { sendContact } from "@/app/actions/contact";
import { Magnetic } from "@/components/motion/Magnetic";
import { PillButton } from "@/components/ui/PillButton";
import type { ContactInput, ContactState } from "@/lib/contactSchema";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };

const fields: Array<{ name: keyof ContactInput; label: string; type: string; autoComplete: string }> = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
];

const inputBase =
  "peer w-full rounded-2xl border bg-bg-elevated/60 px-5 pb-3 pt-7 text-[16px] text-text outline-none transition-[border-color,background-color] duration-300 placeholder:text-transparent focus:border-accent focus:bg-bg-elevated focus-visible:outline-none";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "success" ? (
        <m.div
          key="done"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="flex flex-col items-start gap-4 rounded-card border border-accent/40 bg-accent-soft p-8"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-text-inverse">
            <Check size={20} aria-hidden />
          </span>
          <p className="text-lg">{state.message}</p>
        </m.div>
      ) : (
        <m.form
          key="form"
          action={action}
          noValidate
          exit={{ opacity: 0, y: -12 }}
          className="flex flex-col gap-3"
          aria-describedby={state.status === "error" ? "contact-status" : undefined}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <Field key={f.name} {...f} error={state.fieldErrors?.[f.name]} defaultValue={state.values?.[f.name]} />
            ))}
          </div>
          <Field
            name="message"
            label="What are we building?"
            type="textarea"
            autoComplete="off"
            error={state.fieldErrors?.message}
            defaultValue={state.values?.message}
          />

          {/* Honeypot — hidden from people and assistive tech. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Magnetic>
              <PillButton type="submit" disabled={pending}>
                {pending ? "Sending…" : "Send message"}
              </PillButton>
            </Magnetic>
            {pending && <Loader2 aria-hidden size={18} className="animate-spin text-accent" />}
            <p
              id="contact-status"
              role="alert"
              className={cn("text-[15px]", state.status === "error" ? "text-accent" : "sr-only")}
            >
              {state.status === "error" ? state.message : ""}
            </p>
          </div>
        </m.form>
      )}
    </AnimatePresence>
  );
}

interface FieldProps {
  name: keyof ContactInput;
  label: string;
  type: string;
  autoComplete: string;
  error?: string;
  defaultValue?: string;
}

function Field({ name, label, type, autoComplete, error, defaultValue }: FieldProps) {
  const id = `contact-${name}`;
  const errId = `${id}-error`;
  const common = {
    id,
    name,
    autoComplete,
    required: true,
    placeholder: label,
    defaultValue,
    "aria-invalid": !!error,
    "aria-describedby": error ? errId : undefined,
    className: cn(inputBase, error ? "border-accent/70" : "border-line-strong"),
  };
  return (
    <div className="relative">
      {type === "textarea" ? (
        <textarea rows={5} {...common} className={cn(common.className, "resize-none")} />
      ) : (
        <input type={type} {...common} />
      )}
      <label
        htmlFor={id}
        className="type-label pointer-events-none absolute top-2.5 left-5 text-[12px] text-muted transition-colors peer-focus:text-accent"
      >
        {label}
      </label>
      {error && (
        <p id={errId} className="mt-1.5 pl-2 text-[13px] text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
