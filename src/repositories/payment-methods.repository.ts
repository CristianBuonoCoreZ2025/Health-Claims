import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, PaymentMethod } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class PaymentMethodsRepository extends BaseRepository<"payment_methods"> {
  constructor(client: SupabaseClient<Database>) {
    super("payment_methods", client);
  }

  async listActive(): Promise<PaymentMethod[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<PaymentMethod[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const paymentMethodsQueryKeys = {
  all: () => [...queryKeys.table("payment_methods")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("payment_methods", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("payment_methods", id)] as const,
  active: () => [...queryKeys.tableList("payment_methods", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("payment_methods", { search: "name", name })] as const,
};
