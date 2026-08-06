import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, CompanyPharmacyCode } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class CompanyPharmacyCodesRepository extends BaseRepository<"company_pharmacy_codes"> {
  constructor(client: SupabaseClient<Database>) {
    super("company_pharmacy_codes", client);
  }

  async listActive(): Promise<CompanyPharmacyCode[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByCompany(parentId: string): Promise<CompanyPharmacyCode[]> {
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

export const companyPharmacyCodesQueryKeys = {
  all: () => [...queryKeys.table("company_pharmacy_codes")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("company_pharmacy_codes", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("company_pharmacy_codes", id)] as const,
  active: () => [...queryKeys.tableList("company_pharmacy_codes", { active: true })] as const,
  byCompany: (parentId: string) => [...queryKeys.tableList("company_pharmacy_codes", { parent: "company_id", parentId })] as const,
};
