import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, InsuredAddress } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de insured_addresses. Extiende el CRUD generico con
// listado por asegurado ordenado por etiqueta.
export class InsuredAddressesRepository extends BaseRepository<"insured_addresses"> {
  constructor(client: SupabaseClient<Database>) {
    super("insured_addresses", client);
  }

  async getByInsured(insuredId: string): Promise<InsuredAddress[]> {
    const { data, error } = await this.client
      .from("insured_addresses")
      .select("*")
      .eq("insured_id", insuredId)
      .order("label", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const insuredAddressesQueryKeys = {
  all: () => [...queryKeys.table("insured_addresses")] as const,
  byInsured: (insuredId: string) =>
    [...queryKeys.tableList("insured_addresses", { insured: insuredId })] as const,
};
