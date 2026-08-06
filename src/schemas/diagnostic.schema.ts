import { z } from "zod";

export const diagnosticSchema = z.object({
  code_cie10: z.string().min(1, "El codigo CIE-10 es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type DiagnosticInput = z.input<typeof diagnosticSchema>;
