// Tipos de dominio de Health Claims.
// Re-exporta los tipos generados de Supabase y agrega tipos de dominio
// (Role, Profile, etc.) usados en la app.

export type { Database, Json } from "./database.extended";

import type { Database } from "./database.extended";

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
export type PolicyInsert = Database["public"]["Tables"]["policies"]["Insert"];
export type PolicyUpdate = Database["public"]["Tables"]["policies"]["Update"];
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

export type ServiceGroup = Database["public"]["Tables"]["service_groups"]["Row"];
export type ServiceGroupInsert = Database["public"]["Tables"]["service_groups"]["Insert"];
export type ServiceGroupUpdate = Database["public"]["Tables"]["service_groups"]["Update"];

export type ServiceSubgroup = Database["public"]["Tables"]["service_subgroups"]["Row"];
export type ServiceSubgroupInsert = Database["public"]["Tables"]["service_subgroups"]["Insert"];
export type ServiceSubgroupUpdate = Database["public"]["Tables"]["service_subgroups"]["Update"];

export type ServiceItem = Database["public"]["Tables"]["service_items"]["Row"];
export type ServiceItemInsert = Database["public"]["Tables"]["service_items"]["Insert"];
export type ServiceItemUpdate = Database["public"]["Tables"]["service_items"]["Update"];

export type PolicyConditionHeader = Database["public"]["Tables"]["policy_condition_headers"]["Row"];
export type PolicyConditionHeaderInsert = Database["public"]["Tables"]["policy_condition_headers"]["Insert"];
export type PolicyConditionHeaderUpdate = Database["public"]["Tables"]["policy_condition_headers"]["Update"];

export type PolicyConditionLine = Database["public"]["Tables"]["policy_condition_lines"]["Row"];
export type PolicyConditionLineInsert = Database["public"]["Tables"]["policy_condition_lines"]["Insert"];
export type PolicyConditionLineUpdate = Database["public"]["Tables"]["policy_condition_lines"]["Update"];

export type ClaimForm = Database["public"]["Tables"]["claim_forms"]["Row"];
export type ClaimFormInsert = Database["public"]["Tables"]["claim_forms"]["Insert"];
export type ClaimFormUpdate = Database["public"]["Tables"]["claim_forms"]["Update"];

export type ClaimReceipt = Database["public"]["Tables"]["claim_receipts"]["Row"];
export type ClaimReceiptInsert = Database["public"]["Tables"]["claim_receipts"]["Insert"];
export type ClaimReceiptUpdate = Database["public"]["Tables"]["claim_receipts"]["Update"];

export type ClaimDispatch = Database["public"]["Tables"]["claim_dispatches"]["Row"];
export type ClaimDispatchInsert = Database["public"]["Tables"]["claim_dispatches"]["Insert"];
export type ClaimDispatchUpdate = Database["public"]["Tables"]["claim_dispatches"]["Update"];

export type ClaimPayment = Database["public"]["Tables"]["claim_payments"]["Row"];
export type ClaimPaymentInsert = Database["public"]["Tables"]["claim_payments"]["Insert"];
export type ClaimPaymentUpdate = Database["public"]["Tables"]["claim_payments"]["Update"];

export type ClaimWorkflowStage = Database["public"]["Tables"]["claim_workflow_stages"]["Row"];
export type ClaimWorkflowStageInsert = Database["public"]["Tables"]["claim_workflow_stages"]["Insert"];
export type ClaimWorkflowStageUpdate = Database["public"]["Tables"]["claim_workflow_stages"]["Update"];

export type LiquidatorCompetency = Database["public"]["Tables"]["liquidator_competencies"]["Row"];
export type LiquidatorCompetencyInsert = Database["public"]["Tables"]["liquidator_competencies"]["Insert"];
export type LiquidatorCompetencyUpdate = Database["public"]["Tables"]["liquidator_competencies"]["Update"];

export type LiquidatorLoadCap = Database["public"]["Tables"]["liquidator_load_caps"]["Row"];
export type LiquidatorLoadCapInsert = Database["public"]["Tables"]["liquidator_load_caps"]["Insert"];
export type LiquidatorLoadCapUpdate = Database["public"]["Tables"]["liquidator_load_caps"]["Update"];

export type LiquidatorSchedule = Database["public"]["Tables"]["liquidator_schedules"]["Row"];
export type LiquidatorScheduleInsert = Database["public"]["Tables"]["liquidator_schedules"]["Insert"];
export type LiquidatorScheduleUpdate = Database["public"]["Tables"]["liquidator_schedules"]["Update"];

export type ReassignmentRule = Database["public"]["Tables"]["reassignment_rules"]["Row"];
export type ReassignmentRuleInsert = Database["public"]["Tables"]["reassignment_rules"]["Insert"];
export type ReassignmentRuleUpdate = Database["public"]["Tables"]["reassignment_rules"]["Update"];

export type BatchDownload = Database["public"]["Tables"]["batch_downloads"]["Row"];
export type BatchDownloadInsert = Database["public"]["Tables"]["batch_downloads"]["Insert"];
export type BatchDownloadUpdate = Database["public"]["Tables"]["batch_downloads"]["Update"];

export type ReportTemplate = Database["public"]["Tables"]["report_templates"]["Row"];
export type ReportTemplateInsert = Database["public"]["Tables"]["report_templates"]["Insert"];
export type ReportTemplateUpdate = Database["public"]["Tables"]["report_templates"]["Update"];

export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];

export type DocumentTemplate = Database["public"]["Tables"]["document_templates"]["Row"];
export type DocumentTemplateInsert = Database["public"]["Tables"]["document_templates"]["Insert"];
export type DocumentTemplateUpdate = Database["public"]["Tables"]["document_templates"]["Update"];

export type Broker = Database["public"]["Tables"]["brokers"]["Row"];
export type BrokerInsert = Database["public"]["Tables"]["brokers"]["Insert"];
export type BrokerUpdate = Database["public"]["Tables"]["brokers"]["Update"];
export type PolicyTreeNode = Database["public"]["Tables"]["policy_tree_nodes"]["Row"];
export type PolicyTreeNodeInsert = Database["public"]["Tables"]["policy_tree_nodes"]["Insert"];
export type PolicyTreeNodeUpdate = Database["public"]["Tables"]["policy_tree_nodes"]["Update"];
export type PolicyTreeCondition = Database["public"]["Tables"]["policy_tree_conditions"]["Row"];
export type PolicyTreeConditionInsert = Database["public"]["Tables"]["policy_tree_conditions"]["Insert"];
export type PolicyTreeConditionUpdate = Database["public"]["Tables"]["policy_tree_conditions"]["Update"];
