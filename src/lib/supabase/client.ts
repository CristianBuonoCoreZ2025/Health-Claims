import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types";

// Cliente Supabase para Client Components (browser).
// Solo usa la anon key (nunca la service role).
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa .env.local."
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
