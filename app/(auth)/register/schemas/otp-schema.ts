import { z } from "zod";

// Define form validation schema
export const OtpFormSchema = z.object({
  otp: z.string().min(6, {
    message: "Please enter all 6 digits.",
  }),
});

export type OtpFormValues = z.infer<typeof OtpFormSchema>;
