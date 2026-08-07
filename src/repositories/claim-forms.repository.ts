import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClaimForm, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ClaimFormsRepository extends BaseRepository<"claim_forms"> {
  constructor(client: SupabaseClient<Database>) {
    super("claim_forms", client);
  }

  async getByClaim(claimId: string): Promise<ClaimForm[]> {
    const { data, error } = await this.client
      .from("claim_forms")
      .select("*")
      .eq("claim_id", claimId)
      .order("received_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const claimFormsQueryKeys = {
  all: () => [...queryKeys.table("claim_forms")] as const,
  byClaim: (claimId: string) =>
    [...queryKeys.tableList("claim_forms", { claim: claimId })] as const,
};
