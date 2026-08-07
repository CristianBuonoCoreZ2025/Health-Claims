import { z } from "zod";

export const documentSchema = z.object({
  entity_type: z.string().min(1, "Ingresa el tipo de entidad."),
  entity_id: z.string().uuid("Ingresa un UUID valido."),
  document_type_id: z.string().uuid().optional().nullable(),
  file_path: z.string().optional().nullable(),
  status: z.string().default("pending"),
  uploaded_by: z.string().uuid().optional().nullable(),
});

export type DocumentInput = z.input<typeof documentSchema>;
