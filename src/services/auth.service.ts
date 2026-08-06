import { redirect } from "next/navigation";

import { createSupabaseRouteHandlerClient, createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { ProfilesRepository } from "@/repositories/profiles.repository";
import type { AuthSession } from "@/types";

export type SignInResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: string };

// Inicia sesion con email/password (server action / route handler).
// Devuelve la sesion con el perfil cargado, o un error legible.
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const supabase = await createSupabaseRouteHandlerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { ok: false, error: error?.message ?? "Credenciales invalidas." };
  }

  const profiles = new ProfilesRepository(supabase);
  const profile = await profiles.getByUserId(data.user.id);

  return {
    ok: true,
    session: { userId: data.user.id, email: data.user.email ?? email, profile },
  };
}

// Cierra la sesion y redirige a /login.
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Obtiene la sesion actual (Server Component). Devuelve null si no hay sesion
// o si Supabase no esta configurado (proyecto no vinculado).
export async function getSession(): Promise<AuthSession | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profiles = new ProfilesRepository(supabase);
  const profile = await profiles.getByUserId(user.id);

  return {
    userId: user.id,
    email: user.email ?? "",
    profile,
  };
}
