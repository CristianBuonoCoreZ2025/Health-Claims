import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, PolicyEndorsement } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class PolicyEndorsementsRepository extends BaseRepository<"policy_endorsements"> {
  constructor(client: SupabaseClient<Database>) {
    super("policy_endorsements", client);
  }

  async searchByNumber(number: string): Promise<PolicyEndorsement[]> {
    const { data, error } = await this.client
      .from("policy_endorsements")
      .select("*")
      .ilike("endorsement_number", `%${number}%`)
      .order("start_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async listByPolicy(policyId: string): Promise<PolicyEndorsement[]> {
    const { data, error } = await this.client
      .from("policy_endorsements")
      .select("*")
      .eq("policy_id", policyId)
      .order("start_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<PolicyEndorsement[]> {
    const { data, error } = await this.client
      .from("policy_endorsements")
      .select("*")
      .eq("is_active", true)
      .order("start_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const policyEndorsementsQueryKeys = {
  all: () => [...queryKeys.table("policy_endorsements")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("policy_endorsements", filters)] as const,
  detail: (id: string) =>
    [...queryKeys.tableDetail("policy_endorsements", id)] as const,
  searchByNumber: (number: string) =>
    [...queryKeys.tableList("policy_endorsements", { search: "number", number })] as const,
  byPolicy: (policyId: string) =>
    [...queryKeys.tableList("policy_endorsements", { policy: policyId })] as const,
  active: () =>
    [...queryKeys.tableList("policy_endorsements", { active: true })] as const,
};
