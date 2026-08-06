import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type { ClaimDetail, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de claim_details (detalles de liquidacion). Extiende el CRUD
// generico con listado por claim y carga con relaciones de proveedor,
// diagnostico y medicamento.
export class ClaimDetailsRepository extends BaseRepository<"claim_details"> {
  constructor(client: SupabaseClient<Database>) {
    super("claim_details", client);
  }

  async getByClaim(claimId: string): Promise<ClaimDetail[]> {
    const { data, error } = await this.client
      .from("claim_details")
      .select("*")
      .eq("claim_id", claimId)
      .order("service_date", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getWithRelations(
    id: string
  ): Promise<{ data: ClaimDetail | null; error: PostgrestError | null }> {
    const { data, error } = await this.client
      .from("claim_details")
      .select("*, providers(*), diagnostics(*), medications(*)")
      .eq("id", id)
      .maybeSingle();
    return { data: data ?? null, error };
  }
}

export const claimDetailsQueryKeys = {
  all: () => [...queryKeys.table("claim_details")] as const,
  byClaim: (claimId: string) =>
    [...queryKeys.tableList("claim_details", { claim: claimId })] as const,
  withRelations: (id: string) =>
    [...queryKeys.tableDetail("claim_details", id), "withRelations"] as const,
};
