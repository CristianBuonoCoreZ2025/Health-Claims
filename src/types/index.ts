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

export type Policy = Database["public"]["Tables"]["policies"]["Row"];
export type PolicyCondition = Database["public"]["Tables"]["policy_conditions"]["Row"];
export type Insured = Database["public"]["Tables"]["insureds"]["Row"];
export type PreExistingCondition = Database["public"]["Tables"]["pre_existing_conditions"]["Row"];
export type InsuredAddress = Database["public"]["Tables"]["insured_addresses"]["Row"];
export type InsuredBankAccount = Database["public"]["Tables"]["insured_bank_accounts"]["Row"];

export type ContractType = Database["public"]["Enums"]["contract_type"];
export type PolicyStatus = Database["public"]["Enums"]["policy_status"];
export type RelationshipType = Database["public"]["Enums"]["relationship_type"];
export type GenderType = Database["public"]["Enums"]["gender_type"];

// Sesion autenticada con perfil cargado (usado por hooks/stores de auth).
export interface AuthSession {
  userId: string;
  email: string;
  profile: Profile | null;
}
