import { z } from "zod";

export const bankSchema = z.object({
  abbreviation: z.string().optional().nullable(),
  code: z.string().min(1, "El codigo es obligatorio."),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type BankInput = z.input<typeof bankSchema>;
