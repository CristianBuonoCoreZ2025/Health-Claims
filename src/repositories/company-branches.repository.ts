import type { SupabaseClient } from "@supabase/supabase-js";

import type { CompanyBranch, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class CompanyBranchesRepository extends BaseRepository<"company_branches"> {
  constructor(client: SupabaseClient<Database>) {
    super("company_branches", client);
  }

  async searchByName(name: string): Promise<CompanyBranch[]> {
    const { data, error } = await this.client
      .from("company_branches")
      .select("*")
      .ilike("name", `%${name}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listByCompany(companyId: string): Promise<CompanyBranch[]> {
    const { data, error } = await this.client
      .from("company_branches")
      .select("*")
      .eq("company_id", companyId)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<CompanyBranch[]> {
    const { data, error } = await this.client
      .from("company_branches")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const companyBranchesQueryKeys = {
  all: () => [...queryKeys.table("company_branches")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("company_branches", filters)] as const,
  detail: (id: string) =>
    [...queryKeys.tableDetail("company_branches", id)] as const,
  searchByName: (name: string) =>
    [...queryKeys.tableList("company_branches", { search: "name", name })] as const,
  byCompany: (companyId: string) =>
    [...queryKeys.tableList("company_branches", { company: companyId })] as const,
  active: () =>
    [...queryKeys.tableList("company_branches", { active: true })] as const,
};
