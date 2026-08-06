import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Country } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class CountriesRepository extends BaseRepository<"countries"> {
  constructor(client: SupabaseClient<Database>) {
    super("countries", client);
  }

  async listActive(): Promise<Country[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Country[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const countriesQueryKeys = {
  all: () => [...queryKeys.table("countries")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("countries", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("countries", id)] as const,
  active: () => [...queryKeys.tableList("countries", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("countries", { search: "name", name })] as const,
};
