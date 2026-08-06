import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, CompanyMedicationCode } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class CompanyMedicationCodesRepository extends BaseRepository<"company_medication_codes"> {
  constructor(client: SupabaseClient<Database>) {
    super("company_medication_codes", client);
  }

  async listActive(): Promise<CompanyMedicationCode[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByCompany(parentId: string): Promise<CompanyMedicationCode[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("company_id", parentId)
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const companyMedicationCodesQueryKeys = {
  all: () => [...queryKeys.table("company_medication_codes")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("company_medication_codes", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("company_medication_codes", id)] as const,
  active: () => [...queryKeys.tableList("company_medication_codes", { active: true })] as const,
  byCompany: (parentId: string) => [...queryKeys.tableList("company_medication_codes", { parent: "company_id", parentId })] as const,
};
