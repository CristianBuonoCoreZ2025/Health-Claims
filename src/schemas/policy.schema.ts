import { z } from "zod";

export const policySchema = z.object({
  company_id: z.string().uuid("Selecciona una compania."),
  contractor_id: z.string().uuid().optional().nullable(),
  policy_number: z.string().min(1, "El numero de poliza es obligatorio."),
  endorsement_number: z.string().optional(),
  start_date: z.string().min(1, "La fecha de inicio es obligatoria."),
  end_date: z.string().min(1, "La fecha de termino es obligatoria."),
  holder_name: z.string().min(1, "El nombre del titular es obligatorio."),
  contract_type: z.enum(["individual", "colectivo"]).default("individual"),
  status: z.enum(["vigente", "vencida", "anulada", "pendiente"]).default("pendiente"),
  is_master: z.boolean().default(false),
  master_policy_id: z.string().uuid().optional().nullable(),
  version: z.number().int().min(1).default(1),
  is_active: z.boolean().default(true),
});

export type PolicyInput = z.input<typeof policySchema>;
