import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, CompanyBankCode } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class CompanyBankCodesRepository extends BaseRepository<"company_bank_codes"> {
  constructor(client: SupabaseClient<Database>) {
    super("company_bank_codes", client);
  }

  async listActive(): Promise<CompanyBankCode[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByCompany(parentId: string): Promise<CompanyBankCode[]> {
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

export const companyBankCodesQueryKeys = {
  all: () => [...queryKeys.table("company_bank_codes")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("company_bank_codes", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("company_bank_codes", id)] as const,
  active: () => [...queryKeys.tableList("company_bank_codes", { active: true })] as const,
  byCompany: (parentId: string) => [...queryKeys.tableList("company_bank_codes", { parent: "company_id", parentId })] as const,
};
