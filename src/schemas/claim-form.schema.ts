import { z } from "zod";

export const claimFormSchema = z.object({
  claim_id: z.string().uuid(),
  form_number: z.string().optional(),
  received_by: z.string().optional(),
  received_at: z.string().optional(),
});

export type ClaimFormInput = z.input<typeof claimFormSchema>;
