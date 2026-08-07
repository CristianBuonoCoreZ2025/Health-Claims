import { z } from "zod";

export const claimSchema = z.object({
  policy_id: z.string().uuid("Selecciona una poliza."),
  insured_id: z.string().uuid("Selecciona un asegurado."),
  claim_number: z.string().optional(),
  incident_date: z.string().min(1, "La fecha del incidente es obligatoria."),
  report_date: z.string().min(1, "La fecha de reporte es obligatoria."),
  status: z
    .enum([
      "ingresado",
      "asignado",
      "en_revision",
      "solicitando_antecedentes",
      "aprobado",
      "rechazado",
      "pagado",
    ])
    .default("ingresado"),
  description: z.string().optional(),
  amount_requested: z.number().min(0, "El monto debe ser positivo.").default(0),
  final_reimbursement: z.number().optional(),
  assigned_liquidator_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
  form_number: z.string().optional(),
  receipt_date: z.string().optional().nullable(),
  dispatch_date: z.string().optional().nullable(),
  payment_date: z.string().optional().nullable(),
  payment_amount: z.number().optional().nullable(),
  remittance_number: z.string().optional(),
  settlement_type: z.string().optional(),
  company_settlement_code: z.string().optional(),
  insured_settlement_code: z.string().optional(),
  medical_id: z.string().optional(),
  beneficiary_id: z.string().uuid().optional().nullable(),
});

export type ClaimInput = z.input<typeof claimSchema>;
