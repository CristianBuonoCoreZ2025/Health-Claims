import { z } from "zod";

export const brokerSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  tax_id: z.string().optional().nullable(),
  email: z.string().email("Email invalido.").optional().nullable(),
  phone: z.string().optional().nullable(),
  is_active: z.boolean(),
});

export type BrokerInput = z.infer<typeof brokerSchema>;
