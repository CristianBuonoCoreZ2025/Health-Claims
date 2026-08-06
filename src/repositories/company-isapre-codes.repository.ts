import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, CompanyIsapreCode } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class CompanyIsapreCodesRepository extends BaseRepository<"company_isapre_codes"> {
  constructor(client: SupabaseClient<Database>) {
    super("company_isapre_codes", client);
  }

  async listActive(): Promise<CompanyIsapreCode[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByCompany(parentId: string): Promise<CompanyIsapreCode[]> {
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

export const companyIsapreCodesQueryKeys = {
  all: () => [...queryKeys.table("company_isapre_codes")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("company_isapre_codes", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("company_isapre_codes", id)] as const,
  active: () => [...queryKeys.tableList("company_isapre_codes", { active: true })] as const,
  byCompany: (parentId: string) => [...queryKeys.tableList("company_isapre_codes", { parent: "company_id", parentId })] as const,
};
