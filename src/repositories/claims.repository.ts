import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type { Claim, ClaimDetail, ClaimStatus, ClaimTimeline, Company, Database, Insured, Policy } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de claims (liquidaciones). Extiende el CRUD generico con
// busquedas por numero, listados por estado/liquidador/poliza/asegurado,
// cargas con relaciones y timeline, y listado de recientes.
export class ClaimsRepository extends BaseRepository<"claims"> {
  constructor(client: SupabaseClient<Database>) {
    super("claims", client);
  }

  async searchByNumber(number: string): Promise<Claim[]> {
    const { data, error } = await this.client
      .from("claims")
      .select("*")
      .ilike("claim_number", `%${number}%`)
      .order("report_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async getByStatus(status: ClaimStatus): Promise<Claim[]> {
    const { data, error } = await this.client
      .from("claims")
      .select("*")
      .eq("status", status)
      .order("report_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async getByLiquidator(liquidatorId: string): Promise<Claim[]> {
    const { data, error } = await this.client
      .from("claims")
      .select("*")
      .eq("assigned_liquidator_id", liquidatorId)
      .order("report_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async getByPolicy(policyId: string): Promise<Claim[]> {
    const { data, error } = await this.client
      .from("claims")
      .select("*")
      .eq("policy_id", policyId)
      .order("report_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async getByInsured(insuredId: string): Promise<Claim[]> {
    const { data, error } = await this.client
      .from("claims")
      .select("*")
      .eq("insured_id", insuredId)
      .order("report_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  async getWithRelations(
    id: string
  ): Promise<{
    data:
      | (Claim & {
          policies: (Policy & { companies: Company | null }) | null;
          insureds: Insured | null;
          claim_details: ClaimDetail[];
        })
      | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await this.client
      .from("claims")
      .select("*, policies!policy_id(*, companies(*)), insureds!insured_id(*), claim_details!claim_id(*)")
      .eq("id", id)
      .maybeSingle();
    return { data: data ?? null, error };
  }

  async getWithTimeline(
    id: string
  ): Promise<{
    data: (Claim & { claim_timeline: ClaimTimeline[] }) | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await this.client
      .from("claims")
      .select("*, claim_timeline!claim_id(*)")
      .eq("id", id)
      .maybeSingle();
    return { data: data ?? null, error };
  }

  async listRecent(limit = 20): Promise<Claim[]> {
    const { data, error } = await this.client
      .from("claims")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return data ?? [];
  }
}

export const claimsQueryKeys = {
  all: () => [...queryKeys.table("claims")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("claims", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("claims", id)] as const,
  byStatus: (status: ClaimStatus) =>
    [...queryKeys.tableList("claims", { status })] as const,
  byLiquidator: (liquidatorId: string) =>
    [...queryKeys.tableList("claims", { liquidator: liquidatorId })] as const,
  byPolicy: (policyId: string) =>
    [...queryKeys.tableList("claims", { policy: policyId })] as const,
  byInsured: (insuredId: string) =>
    [...queryKeys.tableList("claims", { insured: insuredId })] as const,
  withRelations: (id: string) =>
    [...queryKeys.tableDetail("claims", id), "withRelations"] as const,
  withTimeline: (id: string) =>
    [...queryKeys.tableDetail("claims", id), "withTimeline"] as const,
  recent: (limit?: number) =>
    [...queryKeys.tableList("claims", { recent: limit ?? 20 })] as const,
};
