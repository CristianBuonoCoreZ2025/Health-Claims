import { z } from "zod";

export const liquidatorScheduleSchema = z.object({
  user_id: z.string().uuid("Selecciona un usuario."),
  day_of_week: z.coerce.number().int().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM."),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM."),
  is_active: z.boolean().default(true),
});

export type LiquidatorScheduleInput = z.input<typeof liquidatorScheduleSchema>;
