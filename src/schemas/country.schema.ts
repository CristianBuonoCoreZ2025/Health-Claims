import { z } from "zod";

export const countrySchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type CountryInput = z.input<typeof countrySchema>;
