import { z } from "zod";

export const isapreSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio."),
  rut: z.string().min(1, "El RUT es obligatorio.")
});

export type IsapreInput = z.input<typeof isapreSchema>;
