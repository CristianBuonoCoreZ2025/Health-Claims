import { z } from "zod";

export const companyProviderCodeSchema = z.object({
  code_1: z.string().optional().nullable(),
  code_2: z.string().optional().nullable(),
  company_id: z.string().uuid("El compania no es valido."),
  is_active: z.boolean().default(true),
  provider_id: z.string().uuid("El prestador no es valido.")
});

export type CompanyProviderCodeInput = z.input<typeof companyProviderCodeSchema>;
