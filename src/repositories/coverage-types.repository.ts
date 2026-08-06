import type { SupabaseClient } from "@supabase/supabase-js";

import type { CoverageType, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de coverage_types. Extiende el CRUD generico con listado de
// tipos de cobertura activos.
export class CoverageTypesRepository extends BaseRepository<"coverage_types"> {
  constructor(client: SupabaseClient<Database>) {
    super("coverage_types", client);
  }

  async listActive(): Promise<CoverageType[]> {
    const { data, error } = await this.client
      .from("coverage_types")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const coverageTypesQueryKeys = {
  all: () => [...queryKeys.table("coverage_types")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("coverage_types", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("coverage_types", id)] as const,
  active: () => [...queryKeys.tableList("coverage_types", { active: true })] as const,
};
