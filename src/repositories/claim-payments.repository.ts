import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClaimPayment, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ClaimPaymentsRepository extends BaseRepository<"claim_payments"> {
  constructor(client: SupabaseClient<Database>) {
    super("claim_payments", client);
  }

  async getByClaim(claimId: string): Promise<ClaimPayment[]> {
    const { data, error } = await this.client
      .from("claim_payments")
      .select("*")
      .eq("claim_id", claimId)
      .order("payment_date", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const claimPaymentsQueryKeys = {
  all: () => [...queryKeys.table("claim_payments")] as const,
  byClaim: (claimId: string) =>
    [...queryKeys.tableList("claim_payments", { claim: claimId })] as const,
};
