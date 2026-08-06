import { z } from "zod";

export const currencySchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type CurrencyInput = z.input<typeof currencySchema>;
