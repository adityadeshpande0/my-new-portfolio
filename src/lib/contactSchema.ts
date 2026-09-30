import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please share your name.").max(80, "That name is a little long."),
  email: z.email("That email doesn't look right.").trim().max(160),
  message: z
    .string()
    .trim()
    .min(10, "A few more words, please (10+ characters).")
    .max(4000, "Please keep it under 4,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
  values?: Partial<ContactInput>;
}
