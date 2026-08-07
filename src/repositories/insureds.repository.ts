import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type {
  Database,
  Insured,
  InsuredAddress,
  InsuredBankAccount,
  PreExistingCondition,
} from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de insureds. Extiende el CRUD generico con busquedas por
// policy/rut/nombre, separacion titular/carga y carga con detalles relacionados.
export class InsuredsRepository extends BaseRepository<"insureds"> {
  constructor(client: SupabaseClient<Database>) {
    super("insureds", client);
  }

  async getByPolicy(policyId: string): Promise<Insured[]> {
    const { data, error } = await this.client
      .from("insureds")
      .select("*")
      .eq("policy_id", policyId)
      .order("is_titular", { ascending: false })
      .order("first_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getTitulares(policyId: string): Promise<Insured[]> {
    const { data, error } = await this.client
      .from("insureds")
      .select("*")
      .eq("policy_id", policyId)
      .eq("is_titular", true)
      .order("first_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getCargas(policyId: string): Promise<Insured[]> {
    const { data, error } = await this.client
      .from("insureds")
      .select("*")
      .eq("policy_id", policyId)
      .eq("is_titular", false)
      .order("first_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByRut(rut: string): Promise<Insured[]> {
    const { data, error } = await this.client
      .from("insureds")
      .select("*")
      .ilike("rut", `%${rut}%`)
      .order("first_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<Insured[]> {
    const { data, error } = await this.client
      .from("insureds")
      .select("*")
      .or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`)
      .order("first_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getWithDetails(
    id: string
  ): Promise<{
    data:
      | (Insured & {
          pre_existing_conditions: PreExistingCondition[];
          insured_addresses: InsuredAddress[];
          insured_bank_accounts: InsuredBankAccount[];
        })
      | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await this.client
      .from("insureds")
      .select("*, pre_existing_conditions!insured_id(*), insured_addresses!insured_id(*), insured_bank_accounts!insured_id(*)")
      .eq("id", id)
      .maybeSingle();
    return { data: data ?? null, error };
  }
}

export const insuredsQueryKeys = {
  all: () => [...queryKeys.table("insureds")] as const,
  byPolicy: (policyId: string) =>
    [...queryKeys.tableList("insureds", { policy: policyId })] as const,
  titulares: (policyId: string) =>
    [...queryKeys.tableList("insureds", { policy: policyId, titular: true })] as const,
  cargas: (policyId: string) =>
    [...queryKeys.tableList("insureds", { policy: policyId, titular: false })] as const,
  byRut: (rut: string) => [...queryKeys.tableList("insureds", { search: "rut", rut })] as const,
  byName: (name: string) =>
    [...queryKeys.tableList("insureds", { search: "name", name })] as const,
  withDetails: (id: string) =>
    [...queryKeys.tableDetail("insureds", id), "withDetails"] as const,
};
