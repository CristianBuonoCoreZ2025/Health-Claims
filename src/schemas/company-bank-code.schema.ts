import { z } from "zod";

export const companyBankCodeSchema = z.object({
  bank_id: z.string().uuid("El banco no es valido."),
  code: z.string().min(1, "El codigo es obligatorio."),
  company_id: z.string().uuid("El compania no es valido."),
  is_active: z.boolean().default(true)
});

export type CompanyBankCodeInput = z.input<typeof companyBankCodeSchema>;
