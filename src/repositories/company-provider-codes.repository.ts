import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, CompanyProviderCode } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class CompanyProviderCodesRepository extends BaseRepository<"company_provider_codes"> {
  constructor(client: SupabaseClient<Database>) {
    super("company_provider_codes", client);
  }

  async listActive(): Promise<CompanyProviderCode[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("code_1", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByCompany(parentId: string): Promise<CompanyProviderCode[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("company_id", parentId)
      .eq("is_active", true)
      .order("code_1", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const companyProviderCodesQueryKeys = {
  all: () => [...queryKeys.table("company_provider_codes")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("company_provider_codes", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("company_provider_codes", id)] as const,
  active: () => [...queryKeys.tableList("company_provider_codes", { active: true })] as const,
  byCompany: (parentId: string) => [...queryKeys.tableList("company_provider_codes", { parent: "company_id", parentId })] as const,
};
