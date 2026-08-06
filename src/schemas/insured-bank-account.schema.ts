import { z } from "zod";

export const insuredBankAccountSchema = z.object({
  insured_id: z.string().uuid(),
  bank_name: z.string().min(1, "El banco es obligatorio."),
  account_number: z.string().min(1, "El numero de cuenta es obligatorio."),
  account_type: z.string().default("corriente"),
  is_active: z.boolean().default(true),
});

export type InsuredBankAccountInput = z.input<typeof insuredBankAccountSchema>;
