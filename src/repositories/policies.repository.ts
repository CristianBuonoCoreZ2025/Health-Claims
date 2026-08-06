import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type { Company, CoverageType, Database, Policy, PolicyCondition, PolicyStatus } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de policies. Extiende el CRUD generico con busquedas por
// numero, listados por compania/estado/activas y cargas con relaciones.
export class PoliciesRepository extends BaseRepository<"policies"> {
  constructor(client: SupabaseClient<Database>) {
    super("policies", client);
  }

  async searchByNumber(number: string): Promise<Policy[]> {
    const { data, error } = await this.client
      .from("policies")
      .select("*")
      .ilike("policy_number", `%${number}%`)
      .order("start_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async getByCompany(companyId: string): Promise<Policy[]> {
    const { data, error } = await this.client
      .from("policies")
      .select("*")
      .eq("company_id", companyId)
      .order("start_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async getByStatus(status: PolicyStatus): Promise<Policy[]> {
    const { data, error } = await this.client
      .from("policies")
      .select("*")
      .eq("status", status)
      .order("start_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<Policy[]> {
    const { data, error } = await this.client
      .from("policies")
      .select("*")
      .eq("is_active", true)
      .order("start_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async getWithCompany(
    id: string
  ): Promise<{ data: (Policy & { companies: Company | null }) | null; error: PostgrestError | null }> {
    const { data, error } = await this.client
      .from("policies")
      .select("*, companies(*)")
      .eq("id", id)
      .maybeSingle();
    return { data: data ?? null, error };
  }

  async getWithConditions(
    id: string
  ): Promise<{
    data:
      | (Policy & {
          policy_conditions: (PolicyCondition & { coverage_types: CoverageType | null })[];
        })
      | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await this.client
      .from("policies")
      .select("*, policy_conditions(*, coverage_types(*))")
      .eq("id", id)
      .maybeSingle();
    return { data: data ?? null, error };
  }
}

export const policiesQueryKeys = {
  all: () => [...queryKeys.table("policies")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("policies", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("policies", id)] as const,
  byCompany: (companyId: string) =>
    [...queryKeys.tableList("policies", { company: companyId })] as const,
  byStatus: (status: PolicyStatus) =>
    [...queryKeys.tableList("policies", { status })] as const,
  active: () => [...queryKeys.tableList("policies", { active: true })] as const,
  withCompany: (id: string) =>
    [...queryKeys.tableDetail("policies", id), "withCompany"] as const,
  withConditions: (id: string) =>
    [...queryKeys.tableDetail("policies", id), "withConditions"] as const,
};
