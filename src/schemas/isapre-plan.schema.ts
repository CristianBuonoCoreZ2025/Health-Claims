import { z } from "zod";

export const isaprePlanSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  is_active: z.boolean().default(true),
  isapre_id: z.string().uuid("El isapre no es valido."),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type IsaprePlanInput = z.input<typeof isaprePlanSchema>;
