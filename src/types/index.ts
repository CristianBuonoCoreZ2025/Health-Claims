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

export type Claim = Database["public"]["Tables"]["claims"]["Row"];
export type ClaimDetail = Database["public"]["Tables"]["claim_details"]["Row"];
export type ClaimTimeline = Database["public"]["Tables"]["claim_timeline"]["Row"];
export type LiquidatorWeight = Database["public"]["Tables"]["liquidator_weights"]["Row"];

export type ClaimStatus = Database["public"]["Enums"]["claim_status"];
export type ClaimActionType = Database["public"]["Enums"]["claim_action_type"];

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


export type Country = Database["public"]["Tables"]["countries"]["Row"];
export type CountryInsert = Database["public"]["Tables"]["countries"]["Insert"];
export type CountryUpdate = Database["public"]["Tables"]["countries"]["Update"];
export type Region = Database["public"]["Tables"]["regions"]["Row"];
export type RegionInsert = Database["public"]["Tables"]["regions"]["Insert"];
export type RegionUpdate = Database["public"]["Tables"]["regions"]["Update"];
export type Currency = Database["public"]["Tables"]["currencies"]["Row"];
export type CurrencyInsert = Database["public"]["Tables"]["currencies"]["Insert"];
export type CurrencyUpdate = Database["public"]["Tables"]["currencies"]["Update"];
export type Bank = Database["public"]["Tables"]["banks"]["Row"];
export type BankInsert = Database["public"]["Tables"]["banks"]["Insert"];
export type BankUpdate = Database["public"]["Tables"]["banks"]["Update"];
export type Laboratory = Database["public"]["Tables"]["laboratories"]["Row"];
export type LaboratoryInsert = Database["public"]["Tables"]["laboratories"]["Insert"];
export type LaboratoryUpdate = Database["public"]["Tables"]["laboratories"]["Update"];
export type Pharmacy = Database["public"]["Tables"]["pharmacies"]["Row"];
export type PharmacyInsert = Database["public"]["Tables"]["pharmacies"]["Insert"];
export type PharmacyUpdate = Database["public"]["Tables"]["pharmacies"]["Update"];
export type Isapre = Database["public"]["Tables"]["isapres"]["Row"];
export type IsapreInsert = Database["public"]["Tables"]["isapres"]["Insert"];
export type IsapreUpdate = Database["public"]["Tables"]["isapres"]["Update"];
export type IsaprePlan = Database["public"]["Tables"]["isapre_plans"]["Row"];
export type IsaprePlanInsert = Database["public"]["Tables"]["isapre_plans"]["Insert"];
export type IsaprePlanUpdate = Database["public"]["Tables"]["isapre_plans"]["Update"];
export type Vademecum = Database["public"]["Tables"]["vademecum"]["Row"];
export type VademecumInsert = Database["public"]["Tables"]["vademecum"]["Insert"];
export type VademecumUpdate = Database["public"]["Tables"]["vademecum"]["Update"];
export type DocumentType = Database["public"]["Tables"]["document_types"]["Row"];
export type DocumentTypeInsert = Database["public"]["Tables"]["document_types"]["Insert"];
export type DocumentTypeUpdate = Database["public"]["Tables"]["document_types"]["Update"];
export type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];
export type PaymentMethodInsert = Database["public"]["Tables"]["payment_methods"]["Insert"];
export type PaymentMethodUpdate = Database["public"]["Tables"]["payment_methods"]["Update"];
export type Specialty = Database["public"]["Tables"]["specialties"]["Row"];
export type SpecialtyInsert = Database["public"]["Tables"]["specialties"]["Insert"];
export type SpecialtyUpdate = Database["public"]["Tables"]["specialties"]["Update"];
export type ParentRelationship = Database["public"]["Tables"]["parent_relationships"]["Row"];
export type ParentRelationshipInsert = Database["public"]["Tables"]["parent_relationships"]["Insert"];
export type ParentRelationshipUpdate = Database["public"]["Tables"]["parent_relationships"]["Update"];
export type LiquidationStatus = Database["public"]["Tables"]["liquidation_statuses"]["Row"];
export type LiquidationStatusInsert = Database["public"]["Tables"]["liquidation_statuses"]["Insert"];
export type LiquidationStatusUpdate = Database["public"]["Tables"]["liquidation_statuses"]["Update"];
export type PendingReason = Database["public"]["Tables"]["pending_reasons"]["Row"];
export type PendingReasonInsert = Database["public"]["Tables"]["pending_reasons"]["Insert"];
export type PendingReasonUpdate = Database["public"]["Tables"]["pending_reasons"]["Update"];
export type DispatchCampaign = Database["public"]["Tables"]["dispatch_campaigns"]["Row"];
export type DispatchCampaignInsert = Database["public"]["Tables"]["dispatch_campaigns"]["Insert"];
export type DispatchCampaignUpdate = Database["public"]["Tables"]["dispatch_campaigns"]["Update"];
export type CompanyProviderCode = Database["public"]["Tables"]["company_provider_codes"]["Row"];
export type CompanyProviderCodeInsert = Database["public"]["Tables"]["company_provider_codes"]["Insert"];
export type CompanyProviderCodeUpdate = Database["public"]["Tables"]["company_provider_codes"]["Update"];
export type CompanyBankCode = Database["public"]["Tables"]["company_bank_codes"]["Row"];
export type CompanyBankCodeInsert = Database["public"]["Tables"]["company_bank_codes"]["Insert"];
export type CompanyBankCodeUpdate = Database["public"]["Tables"]["company_bank_codes"]["Update"];
export type CompanyPharmacyCode = Database["public"]["Tables"]["company_pharmacy_codes"]["Row"];
export type CompanyPharmacyCodeInsert = Database["public"]["Tables"]["company_pharmacy_codes"]["Insert"];
export type CompanyPharmacyCodeUpdate = Database["public"]["Tables"]["company_pharmacy_codes"]["Update"];
export type CompanyIsapreCode = Database["public"]["Tables"]["company_isapre_codes"]["Row"];
export type CompanyIsapreCodeInsert = Database["public"]["Tables"]["company_isapre_codes"]["Insert"];
export type CompanyIsapreCodeUpdate = Database["public"]["Tables"]["company_isapre_codes"]["Update"];
export type CompanyMedicationCode = Database["public"]["Tables"]["company_medication_codes"]["Row"];
export type CompanyMedicationCodeInsert = Database["public"]["Tables"]["company_medication_codes"]["Insert"];
export type CompanyMedicationCodeUpdate = Database["public"]["Tables"]["company_medication_codes"]["Update"];

export type Holding = Database["public"]["Tables"]["holdings"]["Row"];
export type HoldingInsert = Database["public"]["Tables"]["holdings"]["Insert"];
export type HoldingUpdate = Database["public"]["Tables"]["holdings"]["Update"];

export type Contractor = Database["public"]["Tables"]["contractors"]["Row"];
export type ContractorInsert = Database["public"]["Tables"]["contractors"]["Insert"];
export type ContractorUpdate = Database["public"]["Tables"]["contractors"]["Update"];

export type CompanyBranch = Database["public"]["Tables"]["company_branches"]["Row"];
export type CompanyBranchInsert = Database["public"]["Tables"]["company_branches"]["Insert"];
export type CompanyBranchUpdate = Database["public"]["Tables"]["company_branches"]["Update"];

export type PolicyEndorsement = Database["public"]["Tables"]["policy_endorsements"]["Row"];
export type PolicyEndorsementInsert = Database["public"]["Tables"]["policy_endorsements"]["Insert"];
export type PolicyEndorsementUpdate = Database["public"]["Tables"]["policy_endorsements"]["Update"];
