import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class LiquidatorLoadCapsRepository extends BaseRepository<"liquidator_load_caps"> {
  constructor(client: SupabaseClient<Database>) {
    super("liquidator_load_caps", client);
  }
}

export const liquidatorLoadCapsQueryKeys = {
  all: () => [...queryKeys.table("liquidator_load_caps")] as const,
};
