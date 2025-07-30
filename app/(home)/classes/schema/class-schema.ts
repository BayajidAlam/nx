import { z } from "zod";

export const ClassSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Class name must be at least 1 characters long" }),
  shiftId: z
    .string()
    .min(1, { message: "Shift id must be at least 1 characters long" }),
});

export type ClassFormValues = z.infer<typeof ClassSchema>;
