import { z } from "zod";

export const dispatchCampaignSchema = z.object({
  description: z.string().optional().nullable(),
  dispatch_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type DispatchCampaignInput = z.input<typeof dispatchCampaignSchema>;
