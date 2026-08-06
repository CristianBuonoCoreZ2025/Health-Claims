import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, ParentRelationship } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ParentRelationshipsRepository extends BaseRepository<"parent_relationships"> {
  constructor(client: SupabaseClient<Database>) {
    super("parent_relationships", client);
  }

  async listActive(): Promise<ParentRelationship[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<ParentRelationship[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const parentRelationshipsQueryKeys = {
  all: () => [...queryKeys.table("parent_relationships")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("parent_relationships", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("parent_relationships", id)] as const,
  active: () => [...queryKeys.tableList("parent_relationships", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("parent_relationships", { search: "name", name })] as const,
};
