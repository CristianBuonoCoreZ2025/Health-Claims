import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, LiquidationStatus } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class LiquidationStatusesRepository extends BaseRepository<"liquidation_statuses"> {
  constructor(client: SupabaseClient<Database>) {
    super("liquidation_statuses", client);
  }

  async listActive(): Promise<LiquidationStatus[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<LiquidationStatus[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const liquidationStatusesQueryKeys = {
  all: () => [...queryKeys.table("liquidation_statuses")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("liquidation_statuses", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("liquidation_statuses", id)] as const,
  active: () => [...queryKeys.tableList("liquidation_statuses", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("liquidation_statuses", { search: "name", name })] as const,
};
