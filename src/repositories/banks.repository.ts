import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Bank } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class BanksRepository extends BaseRepository<"banks"> {
  constructor(client: SupabaseClient<Database>) {
    super("banks", client);
  }

  async listActive(): Promise<Bank[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Bank[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const banksQueryKeys = {
  all: () => [...queryKeys.table("banks")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("banks", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("banks", id)] as const,
  active: () => [...queryKeys.tableList("banks", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("banks", { search: "name", name })] as const,
};
