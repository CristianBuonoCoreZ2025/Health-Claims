import { z } from "zod";

export const claimDispatchSchema = z.object({
  claim_id: z.string().uuid(),
  remittance_number: z.string().optional(),
  dispatch_date: z.string().optional().nullable(),
  carrier: z.string().optional(),
  tracking_code: z.string().optional(),
});

export type ClaimDispatchInput = z.input<typeof claimDispatchSchema>;
