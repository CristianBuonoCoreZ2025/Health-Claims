import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class LiquidatorSchedulesRepository extends BaseRepository<"liquidator_schedules"> {
  constructor(client: SupabaseClient<Database>) {
    super("liquidator_schedules", client);
  }
}

export const liquidatorSchedulesQueryKeys = {
  all: () => [...queryKeys.table("liquidator_schedules")] as const,
};
