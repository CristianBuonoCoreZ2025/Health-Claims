import { z } from "zod";

export const serviceSubgroupSchema = z.object({
  service_group_id: z.string().uuid("Selecciona un grupo de servicios."),
  code: z.string().min(1, "El codigo es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type ServiceSubgroupInput = z.input<typeof serviceSubgroupSchema>;
