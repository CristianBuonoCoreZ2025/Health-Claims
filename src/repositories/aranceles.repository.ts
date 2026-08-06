import type { SupabaseClient } from "@supabase/supabase-js";

import type { Arancel, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de aranceles. Extiende el CRUD generico con metodos para manejar
// la estructura jerarquica (raices, hijos por padre, por nivel y arbol completo).
export class ArancelesRepository extends BaseRepository<"aranceles"> {
  constructor(client: SupabaseClient<Database>) {
    super("aranceles", client);
  }

  async getRoots(): Promise<Arancel[]> {
    const { data, error } = await this.client
      .from("aranceles")
      .select("*")
      .is("parent_id", null)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getChildren(parentId: string): Promise<Arancel[]> {
    const { data, error } = await this.client
      .from("aranceles")
      .select("*")
      .eq("parent_id", parentId)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getByLevel(level: number): Promise<Arancel[]> {
    const { data, error } = await this.client
      .from("aranceles")
      .select("*")
      .eq("level", level)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getTree(): Promise<Arancel[]> {
    const { data, error } = await this.client
      .from("aranceles")
      .select("*")
      .order("level", { ascending: true })
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const arancelesQueryKeys = {
  all: () => [...queryKeys.table("aranceles")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("aranceles", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("aranceles", id)] as const,
  roots: () => [...queryKeys.tableList("aranceles", { roots: true })] as const,
  children: (parentId: string) =>
    [...queryKeys.tableList("aranceles", { parentId })] as const,
  byLevel: (level: number) =>
    [...queryKeys.tableList("aranceles", { level })] as const,
  tree: () => [...queryKeys.tableList("aranceles", { tree: true })] as const,
};
