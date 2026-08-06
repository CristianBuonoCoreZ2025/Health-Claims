// Validacion y formateo de RUT chileno (modulo 11).

// Normaliza un RUT: solo digitos + K, sin puntos ni guion.
export function normalizeRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

// Calcula el digito verificador de un cuerpo de RUT (modulo 11).
function calculateDv(body: string): string {
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    const digit = Number.parseInt(body[i] ?? "0", 10);
    sum += digit * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return "0";
  if (remainder === 10) return "K";
  return String(remainder);
}

// Valida un RUT chileno (con o sin formato). Devuelve true si el digito
// verificador coincide.
export function isValidRut(rut: string): boolean {
  const clean = normalizeRut(rut);
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (!/^[0-9]+$/.test(body)) return false;
  return calculateDv(body) === dv;
}

// Formatea un RUT con puntos y guion (ej: 12.345.678-9).
export function formatRut(rut: string): string {
  const clean = normalizeRut(rut);
  if (clean.length < 2) return clean;
  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);
  const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withDots}-${dv}`;
}
