import { z } from "zod";

export const claimTimelineSchema = z.object({
  claim_id: z.string().uuid(),
  action_type: z.string().min(1, "El tipo de accion es obligatorio."),
  description: z.string().optional(),
  stage: z.string().optional(),
  sla_minutes: z.number().int().optional(),
});

export type ClaimTimelineInput = z.input<typeof claimTimelineSchema>;
