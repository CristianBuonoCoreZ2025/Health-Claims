// Tipos de dominio de Health Claims.
// Re-exporta los tipos generados de Supabase y agrega tipos de dominio
// (Role, Profile, etc.) usados en la app.

export type { Database, Json } from "./database.generated";

import type { Database } from "./database.generated";

export type Role = Database["public"]["Enums"]["app_role"];

export const ROLES: readonly Role[] = ["admin", "supervisor", "liquidator"] as const;

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Provider = Database["public"]["Tables"]["providers"]["Row"];
export type Diagnostic = Database["public"]["Tables"]["diagnostics"]["Row"];
export type Medication = Database["public"]["Tables"]["medications"]["Row"];
export type CoverageType = Database["public"]["Tables"]["coverage_types"]["Row"];
export type Arancel = Database["public"]["Tables"]["aranceles"]["Row"];
export type ProviderCoverage = Database["public"]["Tables"]["provider_coverages"]["Row"];

// Sesion autenticada con perfil cargado (usado por hooks/stores de auth).
export interface AuthSession {
  userId: string;
  email: string;
  profile: Profile | null;
}
