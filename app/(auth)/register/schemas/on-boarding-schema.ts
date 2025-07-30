import { z } from "zod";

export const onboardingSchema = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be 11 digits")
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number format"),
  eiin: z
    .string()
    .min(1, "EIIN is required")
    .regex(/^\d+$/, "EIIN must contain only numbers"),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;