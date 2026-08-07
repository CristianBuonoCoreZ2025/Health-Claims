import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class DocumentsRepository extends BaseRepository<"documents"> {
  constructor(client: SupabaseClient<Database>) {
    super("documents", client);
  }
}

export const documentsQueryKeys = {
  all: () => [...queryKeys.table("documents")] as const,
};
