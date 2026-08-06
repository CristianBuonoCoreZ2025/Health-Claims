import { z } from "zod";

export const liquidationStatusSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  is_active: z.boolean().default(true),
  is_final: z.boolean().default(false),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type LiquidationStatusInput = z.input<typeof liquidationStatusSchema>;
