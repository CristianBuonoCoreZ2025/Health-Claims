import { z } from "zod";

export const arancelSchema = z.object({
  parent_id: z.string().uuid().optional().nullable(),
  code: z.string().min(1, "El codigo es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional(),
  level: z.number().int().min(1).max(3),
  amount: z.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type ArancelInput = z.input<typeof arancelSchema>;
