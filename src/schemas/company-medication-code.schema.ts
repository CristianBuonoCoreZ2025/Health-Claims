import { z } from "zod";

export const companyMedicationCodeSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  company_id: z.string().uuid("El compania no es valido."),
  is_active: z.boolean().default(true),
  medication_id: z.string().uuid("El medicamento no es valido.")
});

export type CompanyMedicationCodeInput = z.input<typeof companyMedicationCodeSchema>;
