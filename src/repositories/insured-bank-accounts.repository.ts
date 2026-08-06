import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, InsuredBankAccount } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de insured_bank_accounts. Extiende el CRUD generico con
// listado por asegurado ordenado por nombre del banco.
export class InsuredBankAccountsRepository extends BaseRepository<"insured_bank_accounts"> {
  constructor(client: SupabaseClient<Database>) {
    super("insured_bank_accounts", client);
  }

  async getByInsured(insuredId: string): Promise<InsuredBankAccount[]> {
    const { data, error } = await this.client
      .from("insured_bank_accounts")
      .select("*")
      .eq("insured_id", insuredId)
      .order("bank_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const insuredBankAccountsQueryKeys = {
  all: () => [...queryKeys.table("insured_bank_accounts")] as const,
  byInsured: (insuredId: string) =>
    [...queryKeys.tableList("insured_bank_accounts", { insured: insuredId })] as const,
};
