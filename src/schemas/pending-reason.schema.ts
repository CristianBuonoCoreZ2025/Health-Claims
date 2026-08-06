import { z } from "zod";

export const pendingReasonSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type PendingReasonInput = z.input<typeof pendingReasonSchema>;
