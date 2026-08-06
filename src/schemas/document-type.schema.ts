import { z } from "zod";

export const documentTypeSchema = z.object({
  applies_to: z.array(z.string()).default([]),
  code: z.string().min(1, "El codigo es obligatorio."),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type DocumentTypeInput = z.input<typeof documentTypeSchema>;
