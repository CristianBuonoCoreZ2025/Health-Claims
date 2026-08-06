import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Vademecum } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class VademecumRepository extends BaseRepository<"vademecum"> {
  constructor(client: SupabaseClient<Database>) {
    super("vademecum", client);
  }

  async listActive(): Promise<Vademecum[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Vademecum[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async findByLaboratory(parentId: string): Promise<Vademecum[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("laboratory_id", parentId)
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const vademecumQueryKeys = {
  all: () => [...queryKeys.table("vademecum")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("vademecum", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("vademecum", id)] as const,
  active: () => [...queryKeys.tableList("vademecum", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("vademecum", { search: "name", name })] as const,
  byLaboratory: (parentId: string) => [...queryKeys.tableList("vademecum", { parent: "laboratory_id", parentId })] as const,
};
