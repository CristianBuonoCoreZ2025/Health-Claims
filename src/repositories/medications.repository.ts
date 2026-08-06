import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Medication } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de medications. Extiende el CRUD generico con metodos de busqueda
// por nombre y por principio activo, y listado de medicamentos activos.
export class MedicationsRepository extends BaseRepository<"medications"> {
  constructor(client: SupabaseClient<Database>) {
    super("medications", client);
  }

  async searchByName(name: string): Promise<Medication[]> {
    const { data, error } = await this.client
      .from("medications")
      .select("*")
      .ilike("name", `%${name}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByActiveIngredient(ingredient: string): Promise<Medication[]> {
    const { data, error } = await this.client
      .from("medications")
      .select("*")
      .ilike("active_ingredient", `%${ingredient}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<Medication[]> {
    const { data, error } = await this.client
      .from("medications")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const medicationsQueryKeys = {
  all: () => [...queryKeys.table("medications")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("medications", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("medications", id)] as const,
  searchByName: (name: string) =>
    [...queryKeys.tableList("medications", { search: "name", name })] as const,
  searchByActiveIngredient: (ingredient: string) =>
    [...queryKeys.tableList("medications", { search: "ingredient", ingredient })] as const,
  active: () => [...queryKeys.tableList("medications", { active: true })] as const,
};
