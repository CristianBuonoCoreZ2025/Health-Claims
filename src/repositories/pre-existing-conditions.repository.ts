import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, PreExistingCondition } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de pre_existing_conditions. Extiende el CRUD generico con
// listado por asegurado ordenado por nombre.
export class PreExistingConditionsRepository extends BaseRepository<"pre_existing_conditions"> {
  constructor(client: SupabaseClient<Database>) {
    super("pre_existing_conditions", client);
  }

  async getByInsured(insuredId: string): Promise<PreExistingCondition[]> {
    const { data, error } = await this.client
      .from("pre_existing_conditions")
      .select("*")
      .eq("insured_id", insuredId)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const preExistingConditionsQueryKeys = {
  all: () => [...queryKeys.table("pre_existing_conditions")] as const,
  byInsured: (insuredId: string) =>
    [...queryKeys.tableList("pre_existing_conditions", { insured: insuredId })] as const,
};
