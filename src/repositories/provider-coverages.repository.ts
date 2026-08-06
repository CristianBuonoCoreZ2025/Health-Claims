import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type { Database, ProviderCoverage } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de provider_coverages. Extiende el CRUD generico con metodos para
// obtener coberturas por proveedor y por tipo de cobertura, y sincronizar las
// coberturas de un proveedor (eliminar las no incluidas e insertar las nuevas).
export class ProviderCoveragesRepository extends BaseRepository<"provider_coverages"> {
  constructor(client: SupabaseClient<Database>) {
    super("provider_coverages", client);
  }

  async getByProvider(providerId: string): Promise<ProviderCoverage[]> {
    const { data, error } = await this.client
      .from("provider_coverages")
      .select("*")
      .eq("provider_id", providerId)
      .eq("is_active", true)
      .order("coverage_type_id", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getByCoverageType(coverageTypeId: string): Promise<ProviderCoverage[]> {
    const { data, error } = await this.client
      .from("provider_coverages")
      .select("*")
      .eq("coverage_type_id", coverageTypeId)
      .eq("is_active", true)
      .order("provider_id", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async syncProviderCoverages(
    providerId: string,
    coverageTypeIds: string[]
  ): Promise<{ data: ProviderCoverage[] | null; error: PostgrestError | null }> {
    const deleteResult = await this.client
      .from("provider_coverages")
      .delete()
      .eq("provider_id", providerId);
    if (deleteResult.error) {
      return { data: null, error: deleteResult.error };
    }

    if (coverageTypeIds.length === 0) {
      return { data: [], error: null };
    }

    const rows = coverageTypeIds.map((coverageTypeId) => ({
      provider_id: providerId,
      coverage_type_id: coverageTypeId,
      is_active: true,
    }));

    const insertResult = await this.client
      .from("provider_coverages")
      .insert(rows)
      .select("*");
    if (insertResult.error) {
      return { data: null, error: insertResult.error };
    }

    return { data: insertResult.data ?? [], error: null };
  }
}

export const providerCoveragesQueryKeys = {
  all: () => [...queryKeys.table("provider_coverages")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("provider_coverages", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("provider_coverages", id)] as const,
  byProvider: (providerId: string) =>
    [...queryKeys.tableList("provider_coverages", { providerId })] as const,
  byCoverageType: (coverageTypeId: string) =>
    [...queryKeys.tableList("provider_coverages", { coverageTypeId })] as const,
};
