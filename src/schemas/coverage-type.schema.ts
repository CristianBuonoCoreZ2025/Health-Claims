import { z } from "zod";

export const coverageTypeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CoverageTypeInput = z.input<typeof coverageTypeSchema>;
