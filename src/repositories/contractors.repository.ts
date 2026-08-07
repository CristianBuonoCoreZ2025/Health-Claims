import type { SupabaseClient } from "@supabase/supabase-js";

import type { Contractor, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ContractorsRepository extends BaseRepository<"contractors"> {
  constructor(client: SupabaseClient<Database>) {
    super("contractors", client);
  }

  async searchByName(name: string): Promise<Contractor[]> {
    const { data, error } = await this.client
      .from("contractors")
      .select("*")
      .ilike("name", `%${name}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listByHolding(holdingId: string): Promise<Contractor[]> {
    const { data, error } = await this.client
      .from("contractors")
      .select("*")
      .eq("holding_id", holdingId)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<Contractor[]> {
    const { data, error } = await this.client
      .from("contractors")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const contractorsQueryKeys = {
  all: () => [...queryKeys.table("contractors")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("contractors", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("contractors", id)] as const,
  searchByName: (name: string) =>
    [...queryKeys.tableList("contractors", { search: "name", name })] as const,
  byHolding: (holdingId: string) =>
    [...queryKeys.tableList("contractors", { holding: holdingId })] as const,
  active: () => [...queryKeys.tableList("contractors", { active: true })] as const,
};
