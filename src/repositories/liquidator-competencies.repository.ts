import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class LiquidatorCompetenciesRepository extends BaseRepository<"liquidator_competencies"> {
  constructor(client: SupabaseClient<Database>) {
    super("liquidator_competencies", client);
  }
}

export const liquidatorCompetenciesQueryKeys = {
  all: () => [...queryKeys.table("liquidator_competencies")] as const,
};
