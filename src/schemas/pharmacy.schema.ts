import { z } from "zod";

export const pharmacySchema = z.object({
  code: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio."),
  provider_id: z.string().uuid("El prestador no es valido.").optional().nullable()
});

export type PharmacyInput = z.input<typeof pharmacySchema>;
