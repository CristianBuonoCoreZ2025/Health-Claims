import { z } from "zod";

export const specialtySchema = z.object({
  code: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type SpecialtyInput = z.input<typeof specialtySchema>;
