import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type { Database, PolicyCondition } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de policy_conditions. Extiende el CRUD generico con busquedas
// por policy/coverage y sincronizacion batch de condiciones de una poliza.
export class PolicyConditionsRepository extends BaseRepository<"policy_conditions"> {
  constructor(client: SupabaseClient<Database>) {
    super("policy_conditions", client);
  }

  async getByPolicy(policyId: string): Promise<PolicyCondition[]> {
    const { data, error } = await this.client
      .from("policy_conditions")
      .select("*")
      .eq("policy_id", policyId)
      .order("coverage_type_id", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getByPolicyAndCoverage(
    policyId: string,
    coverageTypeId: string
  ): Promise<PolicyCondition | null> {
    const { data, error } = await this.client
      .from("policy_conditions")
      .select("*")
      .eq("policy_id", policyId)
      .eq("coverage_type_id", coverageTypeId)
      .maybeSingle();
    if (error) return null;
    return data ?? null;
  }

  async syncPolicyConditions(
    policyId: string,
    conditions: Database["public"]["Tables"]["policy_conditions"]["Insert"][]
  ): Promise<{ data: PolicyCondition[] | null; error: PostgrestError | null }> {
    const { error: deleteError } = await this.client
      .from("policy_conditions")
      .delete()
      .eq("policy_id", policyId);
    if (deleteError) return { data: null, error: deleteError };

    if (conditions.length === 0) return { data: [], error: null };

    const payload = conditions.map((c) => ({ ...c, policy_id: policyId }));
    const { data, error } = await this.client
      .from("policy_conditions")
      .insert(payload)
      .select("*");
    return { data: data ?? null, error };
  }
}

export const policyConditionsQueryKeys = {
  all: () => [...queryKeys.table("policy_conditions")] as const,
  byPolicy: (policyId: string) =>
    [...queryKeys.tableList("policy_conditions", { policy: policyId })] as const,
  byPolicyAndCoverage: (policyId: string, coverageTypeId: string) =>
    [
      ...queryKeys.tableList("policy_conditions", {
        policy: policyId,
        coverage: coverageTypeId,
      }),
    ] as const,
};
