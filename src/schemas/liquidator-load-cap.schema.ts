import { z } from "zod";

export const liquidatorLoadCapSchema = z.object({
  user_id: z.string().uuid("Selecciona un usuario."),
  max_active_claims: z.coerce.number().int().min(1).default(10),
  company_id: z.string().uuid().optional().nullable(),
  coverage_type_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type LiquidatorLoadCapInput = z.input<typeof liquidatorLoadCapSchema>;
