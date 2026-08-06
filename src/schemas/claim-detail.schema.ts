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
});

export type ClaimDetailInput = z.input<typeof claimDetailSchema>;
