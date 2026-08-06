import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Specialty } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class SpecialtiesRepository extends BaseRepository<"specialties"> {
  constructor(client: SupabaseClient<Database>) {
    super("specialties", client);
  }

  async listActive(): Promise<Specialty[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Specialty[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const specialtiesQueryKeys = {
  all: () => [...queryKeys.table("specialties")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("specialties", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("specialties", id)] as const,
  active: () => [...queryKeys.tableList("specialties", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("specialties", { search: "name", name })] as const,
};
