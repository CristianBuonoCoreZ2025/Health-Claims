import { z } from "zod";

export const serviceItemSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional().nullable(),
  service_subgroup_id: z.string().uuid("Selecciona un subgrupo de servicios."),
  specialty_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type ServiceItemInput = z.input<typeof serviceItemSchema>;
