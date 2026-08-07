import { z } from "zod";

export const documentTemplateSchema = z.object({
  name: z.string().min(1, "Ingresa un nombre."),
  document_type_id: z.string().uuid().optional().nullable(),
  template_type: z.string().min(1, "Ingresa el tipo de plantilla."),
  file_path: z.string().optional().nullable(),
  variables: z.array(z.record(z.unknown())).default([]),
  is_active: z.boolean().default(true),
});

export type DocumentTemplateInput = z.input<typeof documentTemplateSchema>;
