import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Region } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class RegionsRepository extends BaseRepository<"regions"> {
  constructor(client: SupabaseClient<Database>) {
    super("regions", client);
  }

  async listActive(): Promise<Region[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Region[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByCountry(parentId: string): Promise<Region[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("country_id", parentId)
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const regionsQueryKeys = {
  all: () => [...queryKeys.table("regions")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("regions", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("regions", id)] as const,
  active: () => [...queryKeys.tableList("regions", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("regions", { search: "name", name })] as const,
  byCountry: (parentId: string) => [...queryKeys.tableList("regions", { parent: "country_id", parentId })] as const,
};
