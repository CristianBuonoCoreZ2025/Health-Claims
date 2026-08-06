import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Pharmacy } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class PharmaciesRepository extends BaseRepository<"pharmacies"> {
  constructor(client: SupabaseClient<Database>) {
    super("pharmacies", client);
  }

  async listActive(): Promise<Pharmacy[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Pharmacy[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByProvider(parentId: string): Promise<Pharmacy[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("provider_id", parentId)
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const pharmaciesQueryKeys = {
  all: () => [...queryKeys.table("pharmacies")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("pharmacies", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("pharmacies", id)] as const,
  active: () => [...queryKeys.tableList("pharmacies", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("pharmacies", { search: "name", name })] as const,
  byProvider: (parentId: string) => [...queryKeys.tableList("pharmacies", { parent: "provider_id", parentId })] as const,
};
