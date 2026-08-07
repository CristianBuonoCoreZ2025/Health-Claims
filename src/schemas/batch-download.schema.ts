import { z } from "zod";

export const batchDownloadSchema = z.object({
  user_id: z.string().uuid("Selecciona un usuario."),
  entity_type: z.string().min(1, "Ingresa el tipo de entidad."),
  status: z.string().default("pending"),
  file_path: z.string().optional().nullable(),
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional().nullable(),
});

export type BatchDownloadInput = z.input<typeof batchDownloadSchema>;
