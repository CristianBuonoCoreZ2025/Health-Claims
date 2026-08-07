import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, ServiceGroup } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ServiceGroupsRepository extends BaseRepository<"service_groups"> {
  constructor(client: SupabaseClient<Database>) {
    super("service_groups", client);
  }

  async listActive(): Promise<ServiceGroup[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("code", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const serviceGroupsQueryKeys = {
  all: () => [...queryKeys.table("service_groups")] as const,
  list: (filters?: Record<string, unknown>) =>
    [...queryKeys.tableList("service_groups", filters)] as const,
  detail: (id: string) =>
    [...queryKeys.tableDetail("service_groups", id)] as const,
  active: () => [...queryKeys.tableList("service_groups", { active: true })] as const,
};
