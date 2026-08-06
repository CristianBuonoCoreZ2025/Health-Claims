import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Isapre } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class IsapresRepository extends BaseRepository<"isapres"> {
  constructor(client: SupabaseClient<Database>) {
    super("isapres", client);
  }

  async listActive(): Promise<Isapre[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Isapre[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const isapresQueryKeys = {
  all: () => [...queryKeys.table("isapres")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("isapres", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("isapres", id)] as const,
  active: () => [...queryKeys.tableList("isapres", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("isapres", { search: "name", name })] as const,
};
