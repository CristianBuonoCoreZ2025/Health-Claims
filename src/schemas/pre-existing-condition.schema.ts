import { z } from "zod";

export const preExistingConditionSchema = z.object({
  insured_id: z.string().uuid(),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional(),
  diagnosed_date: z.string().optional(),
  is_active: z.boolean().default(true),
  term_months: z.number().int().optional(),
  amount_cap: z.number().optional(),
  dictamen_code: z.string().optional(),
  dictamen_text: z.string().optional(),
  exclusion_date: z.string().optional().nullable(),
  excluded_until: z.string().optional().nullable(),
  is_excluded: z.boolean().default(false),
});

export type PreExistingConditionInput = z.input<typeof preExistingConditionSchema>;
