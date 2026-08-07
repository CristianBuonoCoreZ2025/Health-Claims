import { z } from "zod";

export const policySchema = z.object({
  company_id: z.string().uuid("Selecciona una compania."),
  contractor_id: z.string().uuid("Selecciona un contratista valido.").optional().nullable(),
  policy_number: z.string().min(1, "El numero de poliza es obligatorio."),
  endorsement_number: z.string().optional(),
  start_date: z.string().min(1, "La fecha de inicio es obligatoria."),
  end_date: z.string().min(1, "La fecha de termino es obligatoria."),
  effective_date: z.string().optional().nullable(),
  renewal_date: z.string().optional().nullable(),
  holder_name: z.string().min(1, "El nombre del titular es obligatorio."),
  contract_type: z.enum(["individual", "colectivo"]),
  status: z.enum(["vigente", "vencida", "anulada", "pendiente"]),
  is_master: z.boolean(),
  master_policy_id: z.string().uuid("Selecciona una poliza maestra valida.").optional().nullable(),
  version: z.number().int().min(1, "La version debe ser al menos 1."),
  is_active: z.boolean(),
  broker_id: z.string().uuid("Selecciona un corredor valido.").optional().nullable(),
  sponsor: z.string().optional().nullable(),
  policy_type: z.string().optional().nullable(),
  branch_id: z.string().uuid("Selecciona una filial valida.").optional().nullable(),
});

export type PolicyInput = z.infer<typeof policySchema>;
