import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, LiquidatorWeight } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de liquidator_weights (pesos de liquidadores por tipo de
// cobertura). Extiende el CRUD generico con listados por usuario y por tipo
// de cobertura.
export class LiquidatorWeightsRepository extends BaseRepository<"liquidator_weights"> {
  constructor(client: SupabaseClient<Database>) {
    super("liquidator_weights", client);
  }

  async getByUser(userId: string): Promise<LiquidatorWeight[]> {
    const { data, error } = await this.client
      .from("liquidator_weights")
      .select("*")
      .eq("user_id", userId)
      .order("coverage_type_id", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getByCoverage(coverageTypeId: string): Promise<LiquidatorWeight[]> {
    const { data, error } = await this.client
      .from("liquidator_weights")
      .select("*")
      .eq("coverage_type_id", coverageTypeId);
    if (error) return [];
    return data ?? [];
  }
}

export const liquidatorWeightsQueryKeys = {
  all: () => [...queryKeys.table("liquidator_weights")] as const,
  byUser: (userId: string) =>
    [...queryKeys.tableList("liquidator_weights", { user: userId })] as const,
  byCoverage: (coverageTypeId: string) =>
    [
      ...queryKeys.tableList("liquidator_weights", { coverage: coverageTypeId }),
    ] as const,
};
