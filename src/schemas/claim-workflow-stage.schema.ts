import { z } from "zod";

export const claimWorkflowStageSchema = z.object({
  claim_id: z.string().uuid(),
  stage: z.string().optional(),
  action_type: z.string().optional(),
  sla_minutes: z.number().int().optional().nullable(),
  started_at: z.string().optional(),
  completed_at: z.string().optional().nullable(),
  completed_by: z.string().uuid().optional().nullable(),
  comments: z.string().optional(),
});

export type ClaimWorkflowStageInput = z.input<typeof claimWorkflowStageSchema>;
