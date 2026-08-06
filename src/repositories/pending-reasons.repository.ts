import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, PendingReason } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class PendingReasonsRepository extends BaseRepository<"pending_reasons"> {
  constructor(client: SupabaseClient<Database>) {
    super("pending_reasons", client);
  }

  async listActive(): Promise<PendingReason[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<PendingReason[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const pendingReasonsQueryKeys = {
  all: () => [...queryKeys.table("pending_reasons")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("pending_reasons", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("pending_reasons", id)] as const,
  active: () => [...queryKeys.tableList("pending_reasons", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("pending_reasons", { search: "name", name })] as const,
};
