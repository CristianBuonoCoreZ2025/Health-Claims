import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class DocumentTemplatesRepository extends BaseRepository<"document_templates"> {
  constructor(client: SupabaseClient<Database>) {
    super("document_templates", client);
  }
}

export const documentTemplatesQueryKeys = {
  all: () => [...queryKeys.table("document_templates")] as const,
};
