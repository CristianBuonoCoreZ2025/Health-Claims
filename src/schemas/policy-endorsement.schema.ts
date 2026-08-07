import { z } from "zod";

export const policyEndorsementSchema = z.object({
  policy_id: z.string().uuid("Selecciona una poliza."),
  endorsement_number: z.string().min(1, "El numero de endoso es obligatorio."),
  endorsement_type: z.enum(["aditivo", "sustitutivo", "modificacion", "eliminacion"]),
  start_date: z.string().min(1, "La fecha de inicio es obligatoria."),
  end_date: z.string().optional().nullable(),
  status: z.string().min(1, "El estado es obligatorio."),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type PolicyEndorsementInput = z.input<typeof policyEndorsementSchema>;
