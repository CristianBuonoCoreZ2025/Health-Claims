import { z } from "zod";

export const companyBranchSchema = z.object({
  company_id: z.string().uuid("Selecciona una compania."),
  name: z.string().min(1, "El nombre es obligatorio."),
  code: z.string().optional(),
  address: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CompanyBranchInput = z.input<typeof companyBranchSchema>;
