import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function assertEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Configura .env.local (ver docs/ENV.md).`
    );
  }
  return value;
}

// Cliente Supabase para Server Components, Route Handlers y Server Actions.
// Usa cookies para mantener la sesion del usuario autenticado.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = assertEnv(SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = assertEnv(SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignorar en Server Components (no se puede mutar cookies despues del
          // inicio del request). El middleware refresca la sesion.
        }
      },
    },
  });
}

// Cliente para Route Handlers donde las cookies son mutables.
// En Next 15 `cookies()` es asincrono: se resuelve una vez y se inyecta en
// closures sincronas (createServerClient requiere getAll/setAll sync).
export async function createSupabaseRouteHandlerClient() {
  const cookieStore = await cookies();
  const url = assertEnv(SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = assertEnv(SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
}
