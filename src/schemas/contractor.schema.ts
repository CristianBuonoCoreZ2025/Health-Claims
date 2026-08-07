import { z } from "zod";

export const contractorSchema = z.object({
  holding_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1, "El nombre es obligatorio."),
  rut: z.string().optional(),
  email: z.string().email("El email no es valido.").optional().or(z.literal("")),
  phone: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type ContractorInput = z.input<typeof contractorSchema>;
