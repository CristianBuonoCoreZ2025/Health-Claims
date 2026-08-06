import { z } from "zod";

export const parentRelationshipSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  is_active: z.boolean().default(true),
  max_age_days: z.number().int().optional().nullable(),
  max_age_years: z.number().int().optional().nullable(),
  min_age_days: z.number().int().optional().nullable(),
  min_age_years: z.number().int().optional().nullable(),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type ParentRelationshipInput = z.input<typeof parentRelationshipSchema>;
