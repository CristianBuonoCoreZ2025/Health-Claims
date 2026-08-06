import { z } from "zod";

export const medicationSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  active_ingredient: z.string().optional(),
  dosage: z.string().optional(),
  presentation: z.string().optional(),
  laboratory: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type MedicationInput = z.input<typeof medicationSchema>;
