import { z } from "zod";

export const reassignmentRuleSchema = z.object({
  name: z.string().min(1, "Ingresa un nombre."),
  from_user_id: z.string().uuid().optional().nullable(),
  to_user_id: z.string().uuid().optional().nullable(),
  coverage_type_id: z.string().uuid().optional().nullable(),
  company_id: z.string().uuid().optional().nullable(),
  priority: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type ReassignmentRuleInput = z.input<typeof reassignmentRuleSchema>;
