import { z } from "zod";

export const serviceGroupSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type ServiceGroupInput = z.input<typeof serviceGroupSchema>;
