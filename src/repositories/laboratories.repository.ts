import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Laboratory } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class LaboratoriesRepository extends BaseRepository<"laboratories"> {
  constructor(client: SupabaseClient<Database>) {
    super("laboratories", client);
  }

  async listActive(): Promise<Laboratory[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Laboratory[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const laboratoriesQueryKeys = {
  all: () => [...queryKeys.table("laboratories")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("laboratories", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("laboratories", id)] as const,
  active: () => [...queryKeys.tableList("laboratories", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("laboratories", { search: "name", name })] as const,
};
