import { z } from "zod";

export const policyConditionSchema = z.object({
  policy_id: z.string().uuid(),
  coverage_type_id: z.string().uuid("Selecciona un tipo de cobertura."),
  event_limit: z.number().min(0).default(0),
  yearly_limit: z.number().min(0).default(0),
  deductible_percentage: z.number().min(0).max(100).default(0),
  copayment_percentage: z.number().min(0).max(100).default(0),
  waiting_period_days: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type PolicyConditionInput = z.input<typeof policyConditionSchema>;
