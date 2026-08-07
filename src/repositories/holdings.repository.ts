import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Holding } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class HoldingsRepository extends BaseRepository<"holdings"> {
  constructor(client: SupabaseClient<Database>) {
    super("holdings", client);
  }

  async searchByBusinessName(name: string): Promise<Holding[]> {
    const { data, error } = await this.client
      .from("holdings")
      .select("*")
      .ilike("business_name", `%${name}%`)
      .order("business_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByRut(rut: string): Promise<Holding[]> {
    const { data, error } = await this.client
      .from("holdings")
      .select("*")
      .ilike("rut", `%${rut}%`)
      .order("business_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<Holding[]> {
    const { data, error } = await this.client
      .from("holdings")
      .select("*")
      .eq("is_active", true)
      .order("business_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const holdingsQueryKeys = {
  all: () => [...queryKeys.table("holdings")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("holdings", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("holdings", id)] as const,
  searchByBusinessName: (name: string) =>
    [...queryKeys.tableList("holdings", { search: "business_name", name })] as const,
  searchByRut: (rut: string) =>
    [...queryKeys.tableList("holdings", { search: "rut", rut })] as const,
  active: () => [...queryKeys.tableList("holdings", { active: true })] as const,
};
