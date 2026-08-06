import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, DocumentType } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class DocumentTypesRepository extends BaseRepository<"document_types"> {
  constructor(client: SupabaseClient<Database>) {
    super("document_types", client);
  }

  async listActive(): Promise<DocumentType[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async searchByName(name: string): Promise<DocumentType[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .ilike("name", "%" + name + "%")
      .order("name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const documentTypesQueryKeys = {
  all: () => [...queryKeys.table("document_types")] as const,
  list: (filters?: Record<string, unknown>) => [...queryKeys.tableList("document_types", filters)] as const,
  detail: (id: string) => [...queryKeys.tableDetail("document_types", id)] as const,
  active: () => [...queryKeys.tableList("document_types", { active: true })] as const,
  searchByName: (name: string) => [...queryKeys.tableList("document_types", { search: "name", name })] as const,
};
