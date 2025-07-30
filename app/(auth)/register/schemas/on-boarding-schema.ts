import { phoneRegex } from "@/constants/phone-regex";
import { z } from "zod";

export const OnboardingFormSchema = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be at least 11 digits")
    .regex(phoneRegex, "Invalid phone number format"),
});

export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
