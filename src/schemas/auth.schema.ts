import { z } from "zod";

// Schema de inicio de sesion (email/password).
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio.")
    .email("El email no es valido."),
  password: z
    .string()
    .min(1, "La contrasena es obligatoria.")
    .min(6, "La contrasena debe tener al menos 6 caracteres."),
});

export type LoginInput = z.infer<typeof loginSchema>;
