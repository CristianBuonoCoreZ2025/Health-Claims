import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, ServiceItem } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ServiceItemsRepository extends BaseRepository<"service_items"> {
  constructor(client: SupabaseClient<Database>) {
    super("service_items", client);
  }

  async listActive(): Promise<ServiceItem[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listBySubgroup(subgroupId: string): Promise<ServiceItem[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("service_subgroup_id", subgroupId)
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const serviceItemsQueryKeys = {
  all: () => [...queryKeys.table("service_items")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("service_items", filters)] as const,
  detail: (id: string) =>
    [...queryKeys.tableDetail("service_items", id)] as const,
  active: () =>
    [...queryKeys.tableList("service_items", { active: true })] as const,
  bySubgroup: (subgroupId: string) =>
    [...queryKeys.tableList("service_items", { subgroup: subgroupId })] as const,
};
