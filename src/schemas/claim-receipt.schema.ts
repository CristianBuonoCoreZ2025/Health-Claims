import { z } from "zod";

export const claimReceiptSchema = z.object({
  claim_id: z.string().uuid(),
  document_type_id: z.string().uuid().optional().nullable(),
  receipt_number: z.string().optional(),
  received_at: z.string().optional(),
  verified: z.boolean().default(false),
  notes: z.string().optional(),
});

export type ClaimReceiptInput = z.input<typeof claimReceiptSchema>;
