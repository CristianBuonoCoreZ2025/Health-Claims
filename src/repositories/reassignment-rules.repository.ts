import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ReassignmentRulesRepository extends BaseRepository<"reassignment_rules"> {
  constructor(client: SupabaseClient<Database>) {
    super("reassignment_rules", client);
  }
}

export const reassignmentRulesQueryKeys = {
  all: () => [...queryKeys.table("reassignment_rules")] as const,
};
