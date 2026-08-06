import type { SupabaseClient } from "@supabase/supabase-js";

import type { Company, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de companies. Extiende el CRUD generico con metodos de busqueda
// por nombre y RUT, y listado de empresas activas.
export class CompaniesRepository extends BaseRepository<"companies"> {
  constructor(client: SupabaseClient<Database>) {
    super("companies", client);
  }

  async searchByName(name: string): Promise<Company[]> {
    const { data, error } = await this.client
      .from("companies")
      .select("*")
      .ilike("name", `%${name}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByRut(rut: string): Promise<Company[]> {
    const { data, error } = await this.client
      .from("companies")
      .select("*")
      .ilike("rut", `%${rut}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<Company[]> {
    const { data, error } = await this.client
      .from("companies")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const companiesQueryKeys = {
  all: () => [...queryKeys.table("companies")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("companies", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("companies", id)] as const,
  searchByName: (name: string) =>
    [...queryKeys.tableList("companies", { search: "name", name })] as const,
  searchByRut: (rut: string) =>
    [...queryKeys.tableList("companies", { search: "rut", rut })] as const,
  active: () => [...queryKeys.tableList("companies", { active: true })] as const,
};
