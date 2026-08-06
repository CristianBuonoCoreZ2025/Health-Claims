import { z } from "zod";

export const providerSchema = z.object({
  rut: z.string().min(1, "El RUT es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  business_name: z.string().optional(),
  specialty: z.string().optional(),
  email: z.string().email("El email no es valido.").optional().or(z.literal("")),
  phone: z.string().optional(),
  bank_account: z.string().optional(),
  bank_id: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type ProviderInput = z.input<typeof providerSchema>;
