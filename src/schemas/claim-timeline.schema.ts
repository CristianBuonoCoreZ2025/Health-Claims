import { z } from "zod";

export const claimTimelineSchema = z.object({
  claim_id: z.string().uuid(),
  action_type: z.enum([
    "creado",
    "asignado",
    "en_revision",
    "antecedentes_solicitados",
    "aprobado",
    "rechazado",
    "pagado",
    "comentario",
    "documento_agregado",
  ]),
  description: z.string().optional(),
});

export type ClaimTimelineInput = z.input<typeof claimTimelineSchema>;
