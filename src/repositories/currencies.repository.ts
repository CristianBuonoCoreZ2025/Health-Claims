import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Currency } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class CurrenciesRepository extends BaseRepository<"currencies"> {
  constructor(client: SupabaseClient<Database>) {
    super("currencies", client);
  }

  async listActive(): Promise<Currency[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Currency[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const currenciesQueryKeys = {
  all: () => [...queryKeys.table("currencies")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("currencies", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("currencies", id)] as const,
  active: () => [...queryKeys.tableList("currencies", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("currencies", { search: "name", name })] as const,
};
