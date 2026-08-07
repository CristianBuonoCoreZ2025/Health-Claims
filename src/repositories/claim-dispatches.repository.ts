import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClaimDispatch, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ClaimDispatchesRepository extends BaseRepository<"claim_dispatches"> {
  constructor(client: SupabaseClient<Database>) {
    super("claim_dispatches", client);
  }

  async getByClaim(claimId: string): Promise<ClaimDispatch[]> {
    const { data, error } = await this.client
      .from("claim_dispatches")
      .select("*")
      .eq("claim_id", claimId)
      .order("dispatch_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const claimDispatchesQueryKeys = {
  all: () => [...queryKeys.table("claim_dispatches")] as const,
  byClaim: (claimId: string) =>
    [...queryKeys.tableList("claim_dispatches", { claim: claimId })] as const,
};
