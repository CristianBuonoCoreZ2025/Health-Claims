import { z } from "zod";

export const companyPharmacyCodeSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  company_id: z.string().uuid("El compania no es valido."),
  is_active: z.boolean().default(true),
  pharmacy_id: z.string().uuid("El farmacia no es valido.")
});

export type CompanyPharmacyCodeInput = z.input<typeof companyPharmacyCodeSchema>;
