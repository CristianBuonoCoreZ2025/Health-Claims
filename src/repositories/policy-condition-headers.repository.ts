import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, PolicyConditionHeader } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class PolicyConditionHeadersRepository extends BaseRepository<"policy_condition_headers"> {
  constructor(client: SupabaseClient<Database>) {
    super("policy_condition_headers", client);
  }

  async listActive(): Promise<PolicyConditionHeader[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("effective_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async listByPolicy(policyId: string): Promise<PolicyConditionHeader[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("policy_id", policyId)
      .order("effective_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const policyConditionHeadersQueryKeys = {
  all: () =>
    [...queryKeys.table("policy_condition_headers")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("policy_condition_headers", filters)] as const,
  detail: (id: string) =>
    [...queryKeys.tableDetail("policy_condition_headers", id)] as const,
  active: () =>
    [...queryKeys.tableList("policy_condition_headers", { active: true })] as const,
  byPolicy: (policyId: string) =>
    [...queryKeys.tableList("policy_condition_headers", { policy: policyId })] as const,
};
