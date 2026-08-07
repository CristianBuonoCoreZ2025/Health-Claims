import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

export class ReportTemplatesRepository extends BaseRepository<"report_templates"> {
  constructor(client: SupabaseClient<Database>) {
    super("report_templates", client);
  }
}

export const reportTemplatesQueryKeys = {
  all: () => [...queryKeys.table("report_templates")] as const,
};
