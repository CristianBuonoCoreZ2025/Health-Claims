import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Diagnostic } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de diagnostics. Extiende el CRUD generico con metodos de busqueda
// por codigo CIE-10 y por nombre, y listado de diagnosticos activos.
export class DiagnosticsRepository extends BaseRepository<"diagnostics"> {
  constructor(client: SupabaseClient<Database>) {
    super("diagnostics", client);
  }

  async searchByCode(code: string): Promise<Diagnostic[]> {
    const { data, error } = await this.client
      .from("diagnostics")
      .select("*")
      .ilike("code_cie10", `%${code}%`)
      .order("code_cie10", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Diagnostic[]> {
    const { data, error } = await this.client
      .from("diagnostics")
      .select("*")
      .ilike("name", `%${name}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<Diagnostic[]> {
    const { data, error } = await this.client
      .from("diagnostics")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const diagnosticsQueryKeys = {
  all: () => [...queryKeys.table("diagnostics")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("diagnostics", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("diagnostics", id)] as const,
  searchByCode: (code: string) =>
    [...queryKeys.tableList("diagnostics", { search: "code", code })] as const,
  searchByName: (name: string) =>
    [...queryKeys.tableList("diagnostics", { search: "name", name })] as const,
  active: () => [...queryKeys.tableList("diagnostics", { active: true })] as const,
};
