import { phoneRegex } from "@/constants/phone-regex";
import { z } from "zod";

export const loginFormSchema = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number could be max 11 digits")
    .regex(phoneRegex, "Invalid phone number format"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

export type loginFormValues = z.infer<typeof loginFormSchema>;
