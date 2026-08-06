import { z } from "zod";

export const insuredAddressSchema = z.object({
  insured_id: z.string().uuid(),
  label: z.string().default("principal"),
  street: z.string().min(1, "La direccion es obligatoria."),
  city: z.string().optional(),
  region: z.string().optional(),
  postal_code: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type InsuredAddressInput = z.input<typeof insuredAddressSchema>;
