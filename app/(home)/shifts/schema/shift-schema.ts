import { z } from "zod";

export const ShiftSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Shift name must be at least 1 characters long" }),
});

export type ShiftFormValues = z.infer<typeof ShiftSchema>;
