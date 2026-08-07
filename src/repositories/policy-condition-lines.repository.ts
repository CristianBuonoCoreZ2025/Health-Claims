import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, PolicyConditionLine } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class PolicyConditionLinesRepository extends BaseRepository<"policy_condition_lines"> {
  constructor(client: SupabaseClient<Database>) {
    super("policy_condition_lines", client);
  }

  async listByHeader(headerId: string): Promise<PolicyConditionLine[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("policy_condition_header_id", headerId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const policyConditionLinesQueryKeys = {
  all: () =>
    [...queryKeys.table("policy_condition_lines")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("policy_condition_lines", filters)] as const,
  detail: (id: string) =>
    [...queryKeys.tableDetail("policy_condition_lines", id)] as const,
  byHeader: (headerId: string) =>
    [...queryKeys.tableList("policy_condition_lines", { header: headerId })] as const,
};
