import { z } from "zod";

export const claimPaymentSchema = z.object({
  claim_id: z.string().uuid(),
  amount: z.number().min(0).default(0),
  payment_date: z.string().optional().nullable(),
  payment_method_id: z.string().uuid().optional().nullable(),
  currency_id: z.string().uuid().optional().nullable(),
  reference: z.string().optional(),
  status: z.string().optional(),
});

export type ClaimPaymentInput = z.input<typeof claimPaymentSchema>;
