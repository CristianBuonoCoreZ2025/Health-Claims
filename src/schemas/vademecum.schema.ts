import { z } from "zod";

export const vademecumSchema = z.object({
  active_ingredient: z.string().optional().nullable(),
  code: z.string().min(1, "El codigo es obligatorio."),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  laboratory_id: z.string().uuid("El laboratorio no es valido.").optional().nullable(),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type VademecumInput = z.input<typeof vademecumSchema>;
