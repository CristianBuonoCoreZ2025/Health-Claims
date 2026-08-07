import type { SupabaseClient } from "@supabase/supabase-js";

import type { Broker, Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class BrokersRepository extends BaseRepository<"brokers"> {
  constructor(client: SupabaseClient<Database>) {
    super("brokers", client);
  }

  async listActive(): Promise<Broker[]> {
    const { data, error } = await this.client
      .from("brokers")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByCode(code: string): Promise<Broker[]> {
    const { data, error } = await this.client
      .from("brokers")
      .select("*")
      .ilike("code", `%${code}%`)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const brokersQueryKeys = {
  all: () => [...queryKeys.table("brokers")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("brokers", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("brokers", id)] as const,
  active: () => [...queryKeys.tableList("brokers", { active: true })] as const,
  searchByCode: (code: string) =>
    [...queryKeys.tableList("brokers", { search: "code", code })] as const,
};
