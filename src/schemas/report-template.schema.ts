import { z } from "zod";

export const reportTemplateSchema = z.object({
  name: z.string().min(1, "Ingresa un nombre."),
  template_type: z.string().min(1, "Ingresa el tipo de reporte."),
  applies_to: z.array(z.string()).default([]),
  file_path: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type ReportTemplateInput = z.input<typeof reportTemplateSchema>;
