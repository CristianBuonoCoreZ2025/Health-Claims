import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Profile, Role } from "@/types";
import { BaseRepository, queryKeys } from "./base.repository";

// Repositorio de profiles. Extiende el CRUD generico con metodos de auth
// (obtener perfil por id de usuario, por rol, etc.).
export class ProfilesRepository extends BaseRepository<"profiles"> {
  constructor(client: SupabaseClient<Database>) {
    super("profiles", client);
  }

  async getByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) return null;
    return data;
  }

  async getByRole(role: Role): Promise<Profile[]> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("role", role)
      .eq("is_active", true)
      .order("full_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async listActive(): Promise<Profile[]> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("is_active", true)
      .order("full_name", { ascending: true });
    if (error) return [];
    return data ?? [];
  }
}

export const profilesQueryKeys = {
  detail: (userId: string) => [...queryKeys.tableDetail("profiles", userId)] as const,
  byRole: (role: Role) => [...queryKeys.tableList("profiles", { role })] as const,
  active: () => [...queryKeys.tableList("profiles", { active: true })] as const,
};
