import { z } from "zod";

export const policyTreeNodeSchema = z.object({
  policy_id: z.string().uuid("Selecciona una poliza valida."),
  parent_id: z.string().uuid("Selecciona un nodo padre valido.").optional().nullable(),
  level_code: z.number().int().min(1, "El nivel debe ser al menos 1."),
  node_type: z.string().min(1, "El tipo de nodo es obligatorio."),
  code: z.string().optional().nullable(),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional().nullable(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export type PolicyTreeNodeInput = z.infer<typeof policyTreeNodeSchema>;

export const policyTreeConditionSchema = z.object({
  node_id: z.string().uuid("Selecciona un nodo valido."),
  condition_type: z.string().min(1, "El tipo de condicion es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  yearly_limit: z.number().optional().nullable(),
  per_event_limit: z.number().optional().nullable(),
  lifetime_limit: z.number().optional().nullable(),
  deductible_amount: z.number().optional().nullable(),
  deductible_percentage: z
    .number()
    .min(0, "El porcentaje debe ser entre 0 y 100.")
    .max(100, "El porcentaje debe ser entre 0 y 100.")
    .optional()
    .nullable(),
  copay_percentage: z
    .number()
    .min(0, "El porcentaje debe ser entre 0 y 100.")
    .max(100, "El porcentaje debe ser entre 0 y 100.")
    .optional()
    .nullable(),
  waiting_period_days: z.number().int().optional().nullable(),
  currency_id: z.string().uuid("Selecciona una moneda valida.").optional().nullable(),
  frequency: z.string().optional().nullable(),
  effective_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  rules: z.record(z.unknown()).optional().nullable(),
  is_active: z.boolean(),
});

export type PolicyTreeConditionInput = z.infer<typeof policyTreeConditionSchema>;
