import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClaimWorkflowStage, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ClaimWorkflowStagesRepository extends BaseRepository<"claim_workflow_stages"> {
  constructor(client: SupabaseClient<Database>) {
    super("claim_workflow_stages", client);
  }

  async getByClaim(claimId: string): Promise<ClaimWorkflowStage[]> {
    const { data, error } = await this.client
      .from("claim_workflow_stages")
      .select("*")
      .eq("claim_id", claimId)
      .order("started_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const claimWorkflowStagesQueryKeys = {
  all: () => [...queryKeys.table("claim_workflow_stages")] as const,
  byClaim: (claimId: string) =>
    [...queryKeys.tableList("claim_workflow_stages", { claim: claimId })] as const,
};
