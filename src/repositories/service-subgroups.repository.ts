import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, ServiceSubgroup } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ServiceSubgroupsRepository extends BaseRepository<"service_subgroups"> {
  constructor(client: SupabaseClient<Database>) {
    super("service_subgroups", client);
  }

  async listActive(): Promise<ServiceSubgroup[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listByGroup(groupId: string): Promise<ServiceSubgroup[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("service_group_id", groupId)
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const serviceSubgroupsQueryKeys = {
  all: () => [...queryKeys.table("service_subgroups")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("service_subgroups", filters)] as const,
  detail: (id: string) =>
    [...queryKeys.tableDetail("service_subgroups", id)] as const,
  active: () =>
    [...queryKeys.tableList("service_subgroups", { active: true })] as const,
  byGroup: (groupId: string) =>
    [...queryKeys.tableList("service_subgroups", { group: groupId })] as const,
};
