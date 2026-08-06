import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, IsaprePlan } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class IsaprePlansRepository extends BaseRepository<"isapre_plans"> {
  constructor(client: SupabaseClient<Database>) {
    super("isapre_plans", client);
  }

  async listActive(): Promise<IsaprePlan[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<IsaprePlan[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByIsapre(parentId: string): Promise<IsaprePlan[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("isapre_id", parentId)
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const isaprePlansQueryKeys = {
  all: () => [...queryKeys.table("isapre_plans")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("isapre_plans", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("isapre_plans", id)] as const,
  active: () => [...queryKeys.tableList("isapre_plans", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("isapre_plans", { search: "name", name })] as const,
  byIsapre: (parentId: string) => [...queryKeys.tableList("isapre_plans", { parent: "isapre_id", parentId })] as const,
};
