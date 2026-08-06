import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  rut: z.string().min(1, "El RUT es obligatorio."),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("El email no es valido.").optional().or(z.literal("")),
  holding_id: z.string().uuid().optional().nullable(),
  logo_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CompanyInput = z.input<typeof companySchema>;
