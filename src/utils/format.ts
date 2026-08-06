import { format, parseISO } from "date-fns";

import type { Role } from "@/types";
import { formatRut } from "@/validators/rut.validator";

// Etiquetas legibles para los roles de la aplicacion.
const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  supervisor: "Supervisor",
  liquidator: "Liquidador",
};

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role] ?? role;
}

// Formatea una fecha ISO a dd-MM-yyyy. Devuelve "" si el input es invalido.
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd-MM-yyyy");
  } catch {
    return "";
  }
}

// Formatea una fecha ISO con hora (dd-MM-yyyy HH:mm).
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd-MM-yyyy HH:mm");
  } catch {
    return "";
  }
}

// Formatea un monto como moneda CLP.
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Formatea un RUT chileno (puntos + guion + digito verificador).
// La implementacion canonica vive en @/validators/rut.validator.
export { formatRut };
