import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class BatchDownloadsRepository extends BaseRepository<"batch_downloads"> {
  constructor(client: SupabaseClient<Database>) {
    super("batch_downloads", client);
  }
}

export const batchDownloadsQueryKeys = {
  all: () => [...queryKeys.table("batch_downloads")] as const,
};
