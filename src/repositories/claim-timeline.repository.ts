import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClaimTimeline, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de claim_timeline (historial de acciones de liquidacion).
// Extiende el CRUD generico con listado por claim ordenado por fecha.
export class ClaimTimelineRepository extends BaseRepository<"claim_timeline"> {
  constructor(client: SupabaseClient<Database>) {
    super("claim_timeline", client);
  }

  async getByClaim(claimId: string): Promise<ClaimTimeline[]> {
    const { data, error } = await this.client
      .from("claim_timeline")
      .select("*")
      .eq("claim_id", claimId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const claimTimelineQueryKeys = {
  all: () => [...queryKeys.table("claim_timeline")] as const,
  byClaim: (claimId: string) =>
    [...queryKeys.tableList("claim_timeline", { claim: claimId })] as const,
};
