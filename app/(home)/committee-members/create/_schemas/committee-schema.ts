import { phoneRegex } from "@/constants/phone-regex";
import { z } from "zod";

export const teacherFormSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter a valid  name",
  }),
  email: z.string().email("Please enter a valid email address"),

  designation: z.string().min(2, {
    message: "Please enter a valid designation",
  }),

  phone: z.object({
    countryCode: z.string().min(1, "Please select a country code"),
    number: z
      .string()
      .min(6, "Phone number must be at least 6 digits")
      .regex(phoneRegex, "Invalid phone number format"),
  }),

  photoUrl: z.string().optional(),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;
