import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClaimReceipt, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ClaimReceiptsRepository extends BaseRepository<"claim_receipts"> {
  constructor(client: SupabaseClient<Database>) {
    super("claim_receipts", client);
  }

  async getByClaim(claimId: string): Promise<ClaimReceipt[]> {
    const { data, error } = await this.client
      .from("claim_receipts")
      .select("*")
      .eq("claim_id", claimId)
      .order("received_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const claimReceiptsQueryKeys = {
  all: () => [...queryKeys.table("claim_receipts")] as const,
  byClaim: (claimId: string) =>
    [...queryKeys.tableList("claim_receipts", { claim: claimId })] as const,
};
