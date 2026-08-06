import { z } from "zod";

export const liquidatorWeightSchema = z.object({
  user_id: z.string().uuid("Selecciona un liquidador."),
  coverage_type_id: z.string().uuid().optional().nullable(),
  level: z.string().default("general"),
  weight_value: z.number().min(0).default(1.0),
  is_active: z.boolean().default(true),
});

export type LiquidatorWeightInput = z.input<typeof liquidatorWeightSchema>;
