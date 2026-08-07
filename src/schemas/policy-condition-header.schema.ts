import { z } from "zod";

export const policyConditionHeaderSchema = z.object({
  policy_id: z.string().uuid("Selecciona una poliza."),
  endorsement_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1, "El nombre es obligatorio."),
  condition_type: z.string().min(1, "El tipo de condicion es obligatorio."),
  effective_date: z.string().min(1, "La fecha de vigencia es obligatoria."),
  expiration_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type PolicyConditionHeaderInput = z.input<typeof policyConditionHeaderSchema>;
