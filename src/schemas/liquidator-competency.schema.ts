import { z } from "zod";

export const liquidatorCompetencySchema = z.object({
  user_id: z.string().uuid("Selecciona un usuario."),
  service_group_id: z.string().uuid("Selecciona un grupo de servicios."),
  level: z.coerce.number().int().min(1).default(1),
  is_active: z.boolean().default(true),
});

export type LiquidatorCompetencyInput = z.input<typeof liquidatorCompetencySchema>;
