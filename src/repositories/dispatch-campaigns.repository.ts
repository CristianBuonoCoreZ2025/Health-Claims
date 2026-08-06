import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, DispatchCampaign } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class DispatchCampaignsRepository extends BaseRepository<"dispatch_campaigns"> {
  constructor(client: SupabaseClient<Database>) {
    super("dispatch_campaigns", client);
  }

  async listActive(): Promise<DispatchCampaign[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<DispatchCampaign[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const dispatchCampaignsQueryKeys = {
  all: () => [...queryKeys.table("dispatch_campaigns")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("dispatch_campaigns", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("dispatch_campaigns", id)] as const,
  active: () => [...queryKeys.tableList("dispatch_campaigns", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("dispatch_campaigns", { search: "name", name })] as const,
};
