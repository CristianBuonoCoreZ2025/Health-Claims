import type { Database as GeneratedDatabase } from "./database.generated";

export type { Json } from "./database.generated";

type TableDefinition<R, Rel extends { foreignKeyName: string; columns: string[]; isOneToOne: boolean; referencedRelation: string; referencedColumns: string[] }[] = []> = {
  Row: R;
  Insert: Partial<R>;
  Update: Partial<R>;
  Relationships: Rel;
};

type ServiceGroupRow = {
  id: string; code: string; name: string; description: string | null; is_active: boolean;
  created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type ServiceSubgroupRow = {
  id: string; service_group_id: string; code: string; name: string; description: string | null; is_active: boolean;
  created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type ServiceItemRow = {
  id: string; code: string; name: string; description: string | null; service_subgroup_id: string; specialty_id: string | null;
  is_active: boolean; created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type PolicyConditionHeaderRow = {
  id: string; policy_id: string; endorsement_id: string | null; name: string; condition_type: string; effective_date: string;
  expiration_date: string | null; is_active: boolean; created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type PolicyConditionLineRow = {
  id: string; policy_condition_header_id: string; coverage_type_id: string | null; service_group_id: string | null; service_subgroup_id: string | null;
  service_item_id: string | null; classification: string | null; status: string | null; sub_policy: string | null; sub_endorsement: string | null;
  associated_balance: string | null; catastrophic: boolean | null; cat_extension: string | null; branch: string | null; fld: number | null; fsl: number | null;
  free_doctor: boolean | null; franchise: number | null; imed_range: string | null; medipass_range: string | null; web_reimbursement_range: string | null;
  financier_range: string | null; premium_currency: string | null; capita: number | null; premium: number | null; loads: number | null; evaluate_by: string | null;
  isapre_bm_amount: number | null; isapre_bm_percentage: number | null; isapre_bm_code: string | null; fonasa_bm_amount: number | null; fonasa_bm_percentage: number | null;
  fonasa_bm_code: string | null; pharmacy_limit: number | null; preferential_provider: boolean | null; limit_and_deductible: string | null; is_active: boolean;
  created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type Policies = {
  Row: GeneratedDatabase["public"]["Tables"]["policies"]["Row"] & { effective_date: string | null; renewal_date: string | null };
  Insert: GeneratedDatabase["public"]["Tables"]["policies"]["Insert"] & { effective_date?: string | null; renewal_date?: string | null };
  Update: GeneratedDatabase["public"]["Tables"]["policies"]["Update"] & { effective_date?: string | null; renewal_date?: string | null };
  Relationships: GeneratedDatabase["public"]["Tables"]["policies"]["Relationships"];
};

type InsuredRow = {
  id: string; policy_id: string; rut: string; first_name: string; last_name: string; birth_date: string | null;
  gender: string | null; relationship: GeneratedDatabase["public"]["Enums"]["relationship_type"]; email: string | null; phone: string | null; is_titular: boolean; is_active: boolean;
  created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
  beneficiary_rut: string | null; document_type: string | null; document_number: string | null; nationality: string | null;
  country_id: string | null; region_id: string | null; city_id: string | null; commune_id: string | null; postal_code: string | null;
  cell_phone: string | null; marital_status: string | null; occupation: string | null;
};

type InsuredsRel = [
  { foreignKeyName: "insureds_policy_id_fkey"; columns: ["policy_id"]; isOneToOne: false; referencedRelation: "policies"; referencedColumns: ["id"] },
  { foreignKeyName: "pre_existing_conditions_insured_id_fkey"; columns: ["id"]; isOneToOne: false; referencedRelation: "pre_existing_conditions"; referencedColumns: ["insured_id"] },
  { foreignKeyName: "insured_addresses_insured_id_fkey"; columns: ["id"]; isOneToOne: false; referencedRelation: "insured_addresses"; referencedColumns: ["insured_id"] },
  { foreignKeyName: "insured_bank_accounts_insured_id_fkey"; columns: ["id"]; isOneToOne: false; referencedRelation: "insured_bank_accounts"; referencedColumns: ["insured_id"] },
];

type PreExistingConditionRow = {
  id: string; insured_id: string; name: string; description: string | null; diagnosed_date: string | null;
  is_active: boolean; created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
  term_months: number | null; amount_cap: number | null; dictamen_code: string | null; dictamen_text: string | null;
  exclusion_date: string | null; excluded_until: string | null; is_excluded: boolean;
};

type ClaimsRow = {
  id: string; policy_id: string; insured_id: string; claim_number: string; incident_date: string; report_date: string;
  status: GeneratedDatabase["public"]["Enums"]["claim_status"]; description: string | null; amount_requested: number; final_reimbursement: number | null;
  assigned_liquidator_id: string | null; is_active: boolean; created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
  form_number: string | null; receipt_date: string | null; dispatch_date: string | null; payment_date: string | null; payment_amount: number | null;
  remittance_number: string | null; settlement_type: string | null; company_settlement_code: string | null; insured_settlement_code: string | null;
  medical_id: string | null; beneficiary_id: string | null;
};

type ClaimsRel = [
  { foreignKeyName: "claims_insured_id_fkey"; columns: ["insured_id"]; isOneToOne: false; referencedRelation: "insureds"; referencedColumns: ["id"] },
  { foreignKeyName: "claims_beneficiary_id_fkey"; columns: ["beneficiary_id"]; isOneToOne: false; referencedRelation: "insureds"; referencedColumns: ["id"] },
  { foreignKeyName: "claims_policy_id_fkey"; columns: ["policy_id"]; isOneToOne: false; referencedRelation: "policies"; referencedColumns: ["id"] },
  { foreignKeyName: "claim_details_claim_id_fkey"; columns: ["id"]; isOneToOne: false; referencedRelation: "claim_details"; referencedColumns: ["claim_id"] },
  { foreignKeyName: "claim_timeline_claim_id_fkey"; columns: ["id"]; isOneToOne: false; referencedRelation: "claim_timeline"; referencedColumns: ["claim_id"] },
];

type ClaimDetailRow = {
  id: string; claim_id: string; provider_id: string | null; diagnostic_id: string | null; medication_id: string | null; coverage_type_id: string | null;
  service_date: string; amount: number; deductible_applied: number; copayment_applied: number; final_reimbursement: number; observation: string | null;
  is_active: boolean; created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
  service_group_id: string | null; service_subgroup_id: string | null; service_item_id: string | null; company_code: string | null; pharmacy_id: string | null;
  imed_amount: number; medipass_amount: number; web_reimbursement_amount: number; financier_amount: number; excess_amount: number; pharmacy_limit_applied: boolean;
};

type ClaimTimelineRow = {
  id: string; claim_id: string; action_type: string; description: string | null; stage: string | null; sla_minutes: number | null;
  created_by: string | null; created_at: string; updated_at: string; updated_by: string | null;
};

type ClaimFormRow = {
  id: string; claim_id: string; form_number: string | null; received_by: string | null; received_at: string | null;
  created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type ClaimReceiptRow = {
  id: string; claim_id: string; document_type_id: string | null; receipt_number: string | null; received_at: string | null;
  verified: boolean; notes: string | null; created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type ClaimDispatchRow = {
  id: string; claim_id: string; remittance_number: string | null; dispatch_date: string | null; carrier: string | null;
  tracking_code: string | null; created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type ClaimPaymentRow = {
  id: string; claim_id: string; amount: number; payment_date: string | null; payment_method_id: string | null;
  currency_id: string | null; reference: string | null; status: string | null;
  created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type ClaimWorkflowStageRow = {
  id: string; claim_id: string; stage: string | null; action_type: string | null; sla_minutes: number | null; started_at: string;
  completed_at: string | null; completed_by: string | null; comments: string | null;
  created_at: string; updated_at: string; created_by: string | null; updated_by: string | null;
};

type ExistingTables = GeneratedDatabase["public"]["Tables"];

type ExtendedTables = Omit<ExistingTables, "insureds" | "pre_existing_conditions" | "claims" | "claim_details" | "claim_timeline"> & {
  policies: Policies;
  service_groups: TableDefinition<ServiceGroupRow>;
  service_subgroups: TableDefinition<ServiceSubgroupRow>;
  service_items: TableDefinition<ServiceItemRow>;
  policy_condition_headers: TableDefinition<PolicyConditionHeaderRow>;
  policy_condition_lines: TableDefinition<PolicyConditionLineRow>;
  insureds: TableDefinition<InsuredRow, InsuredsRel>;
  pre_existing_conditions: TableDefinition<PreExistingConditionRow, GeneratedDatabase["public"]["Tables"]["pre_existing_conditions"]["Relationships"]>;
  claims: TableDefinition<ClaimsRow, ClaimsRel>;
  claim_details: TableDefinition<ClaimDetailRow, GeneratedDatabase["public"]["Tables"]["claim_details"]["Relationships"]>;
  claim_timeline: TableDefinition<ClaimTimelineRow, GeneratedDatabase["public"]["Tables"]["claim_timeline"]["Relationships"]>;
  claim_forms: TableDefinition<ClaimFormRow>;
  claim_receipts: TableDefinition<ClaimReceiptRow>;
  claim_dispatches: TableDefinition<ClaimDispatchRow>;
  claim_payments: TableDefinition<ClaimPaymentRow>;
  claim_workflow_stages: TableDefinition<ClaimWorkflowStageRow>;
};

export type Database = {
  __InternalSupabase: GeneratedDatabase["__InternalSupabase"];
  public: Omit<GeneratedDatabase["public"], "Tables"> & {
    Tables: ExtendedTables;
  };
};
