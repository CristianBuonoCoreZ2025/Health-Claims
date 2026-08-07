import { z } from "zod";

export const holdingSchema = z.object({
  rut: z.string().min(1, "El RUT es obligatorio."),
  business_name: z.string().min(1, "La razon social es obligatoria."),
  email: z.string().email("El email no es valido.").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type HoldingInput = z.input<typeof holdingSchema>;
