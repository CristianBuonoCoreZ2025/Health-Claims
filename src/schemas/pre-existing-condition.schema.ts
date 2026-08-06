import { z } from "zod";

export const preExistingConditionSchema = z.object({
  insured_id: z.string().uuid(),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional(),
  diagnosed_date: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type PreExistingConditionInput = z.input<typeof preExistingConditionSchema>;
