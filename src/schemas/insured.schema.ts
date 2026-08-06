import { z } from "zod";

export const insuredSchema = z.object({
  policy_id: z.string().uuid(),
  rut: z.string().min(1, "El RUT es obligatorio."),
  first_name: z.string().min(1, "El nombre es obligatorio."),
  last_name: z.string().min(1, "El apellido es obligatorio."),
  birth_date: z.string().optional(),
  gender: z.enum(["masculino", "femenino", "otro"]).optional(),
  relationship: z.enum(["titular", "conyuge", "hijo", "otro"]).default("titular"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  is_titular: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export type InsuredInput = z.input<typeof insuredSchema>;
