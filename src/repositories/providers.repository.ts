import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Provider } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de providers. Extiende el CRUD generico con metodos de busqueda
// por nombre, listado de proveedores activos y obtencion con coberturas.
export class ProvidersRepository extends BaseRepository<"providers"> {
  constructor(client: SupabaseClient<Database>) {
    super("providers", client);
  }

  async searchByName(name: string): Promise<Provider[]> {
    const { data, error } = await this.client
      .from("providers")
      .select("*")
      .ilike("name", `%${name}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<Provider[]> {
    const { data, error } = await this.client
      .from("providers")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getWithCoverages(
    providerId: string
  ): Promise<{ provider: Provider | null; coverages: ProviderCoverageRow[] }> {
    const { data: provider, error: providerError } = await this.client
      .from("providers")
      .select("*")
      .eq("id", providerId)
      .maybeSingle();
    if (providerError) return { provider: null, coverages: [] };

    const { data: coverages, error: coveragesError } = await this.client
      .from("provider_coverages")
      .select(
        "id, provider_id, coverage_type_id, is_active, created_at, updated_at, coverage_types(id, name, description)"
      )
      .eq("provider_id", providerId)
      .eq("is_active", true);
    if (coveragesError) return { provider: provider ?? null, coverages: [] };

    return { provider: provider ?? null, coverages: coverages ?? [] };
  }
}

type ProviderCoverageRow = {
  id: string;
  provider_id: string;
  coverage_type_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  coverage_types: {
    id: string;
    name: string;
    description: string | null;
  } | null;
};

export const providersQueryKeys = {
  all: () => [...queryKeys.table("providers")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("providers", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("providers", id)] as const,
  searchByName: (name: string) =>
    [...queryKeys.tableList("providers", { search: "name", name })] as const,
  active: () => [...queryKeys.tableList("providers", { active: true })] as const,
  withCoverages: (providerId: string) =>
    [...queryKeys.tableDetail("providers", providerId), "coverages"] as const,
};
