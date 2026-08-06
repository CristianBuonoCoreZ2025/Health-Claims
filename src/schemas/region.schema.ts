import { z } from "zod";

export const regionSchema = z.object({
  code: z.string().min(1, "El codigo es obligatorio."),
  country_id: z.string().uuid("El pais no es valido."),
  is_active: z.boolean().default(true),
  name: z.string().min(1, "El nombre es obligatorio.")
});

export type RegionInput = z.input<typeof regionSchema>;
