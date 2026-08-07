import type { Database as GeneratedDatabase } from "./database.generated";

export type { Json } from "./database.generated";

type TableDefinition<R> = {
  Row: R;
  Insert: Partial<R>;
  Update: Partial<R>;
  Relationships: {
    foreignKeyName: string;
    columns: string[];
    isOneToOne: boolean;
    referencedRelation: string;
    referencedColumns: string[];
  }[];
};

type ServiceGroupRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

type ServiceSubgroupRow = {
  id: string;
  service_group_id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

type ServiceItemRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  service_subgroup_id: string;
  specialty_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

type PolicyConditionHeaderRow = {
  id: string;
  policy_id: string;
  endorsement_id: string | null;
  name: string;
  condition_type: string;
  effective_date: string;
  expiration_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

type PolicyConditionLineRow = {
  id: string;
  policy_condition_header_id: string;
  coverage_type_id: string | null;
  service_group_id: string | null;
  service_subgroup_id: string | null;
  service_item_id: string | null;
  classification: string | null;
  status: string | null;
  sub_policy: string | null;
  sub_endorsement: string | null;
  associated_balance: string | null;
  catastrophic: boolean | null;
  cat_extension: string | null;
  branch: string | null;
  fld: number | null;
  fsl: number | null;
  free_doctor: boolean | null;
  franchise: number | null;
  imed_range: string | null;
  medipass_range: string | null;
  web_reimbursement_range: string | null;
  financier_range: string | null;
  premium_currency: string | null;
  capita: number | null;
  premium: number | null;
  loads: number | null;
  evaluate_by: string | null;
  isapre_bm_amount: number | null;
  isapre_bm_percentage: number | null;
  isapre_bm_code: string | null;
  fonasa_bm_amount: number | null;
  fonasa_bm_percentage: number | null;
  fonasa_bm_code: string | null;
  pharmacy_limit: number | null;
  preferential_provider: boolean | null;
  limit_and_deductible: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

type PoliciesBase = GeneratedDatabase["public"]["Tables"]["policies"];

type Policies = {
  Row: PoliciesBase["Row"] & { effective_date: string | null; renewal_date: string | null };
  Insert: PoliciesBase["Insert"] & { effective_date?: string | null; renewal_date?: string | null };
  Update: PoliciesBase["Update"] & { effective_date?: string | null; renewal_date?: string | null };
  Relationships: PoliciesBase["Relationships"];
};

type ExistingTables = GeneratedDatabase["public"]["Tables"];

type ExtendedTables = Omit<ExistingTables, "policies"> & {
  policies: Policies;
  service_groups: TableDefinition<ServiceGroupRow>;
  service_subgroups: TableDefinition<ServiceSubgroupRow>;
  service_items: TableDefinition<ServiceItemRow>;
  policy_condition_headers: TableDefinition<PolicyConditionHeaderRow>;
  policy_condition_lines: TableDefinition<PolicyConditionLineRow>;
};

export type Database = {
  __InternalSupabase: GeneratedDatabase["__InternalSupabase"];
  public: Omit<GeneratedDatabase["public"], "Tables"> & {
    Tables: ExtendedTables;
  };
};
