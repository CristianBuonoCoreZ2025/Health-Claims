import { z } from "zod";

export const claimDetailSchema = z.object({
  claim_id: z.string().uuid(),
  provider_id: z.string().uuid().optional().nullable(),
  diagnostic_id: z.string().uuid().optional().nullable(),
  medication_id: z.string().uuid().optional().nullable(),
  coverage_type_id: z.string().uuid().optional().nullable(),
  service_date: z.string().min(1, "La fecha de prestacion es obligatoria."),
  amount: z.number().min(0).default(0),
  deductible_applied: z.number().min(0).default(0),
  copayment_applied: z.number().min(0).default(0),
  final_reimbursement: z.number().min(0).default(0),
  observation: z.string().optional(),
  is_active: z.boolean().default(true),
  service_group_id: z.string().uuid().optional().nullable(),
  service_subgroup_id: z.string().uuid().optional().nullable(),
  service_item_id: z.string().uuid().optional().nullable(),
  company_code: z.string().optional(),
  pharmacy_id: z.string().uuid().optional().nullable(),
  imed_amount: z.number().min(0).default(0),
  medipass_amount: z.number().min(0).default(0),
  web_reimbursement_amount: z.number().min(0).default(0),
  financier_amount: z.number().min(0).default(0),
  excess_amount: z.number().min(0).default(0),
  pharmacy_limit_applied: z.boolean().default(false),
});

export type ClaimDetailInput = z.input<typeof claimDetailSchema>;
