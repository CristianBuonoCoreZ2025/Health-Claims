import { z } from "zod";

export const companyIsapreCodeSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  company_id: z.string().uuid("El compania no es valido."),
  is_active: z.boolean().default(true),
  isapre_id: z.string().uuid("El isapre no es valido."),
  isapre_plan_id: z.string().uuid("El plan de isapre no es valido.").optional().nullable()
});

export type CompanyIsapreCodeInput = z.input<typeof companyIsapreCodeSchema>;
