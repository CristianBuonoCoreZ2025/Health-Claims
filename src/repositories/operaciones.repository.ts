import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";

// Tipo de fila de la vista liquidator_workload.
export type LiquidatorWorkload = Database["public"]["Views"]["liquidator_workload"]["Row"];

// Tipo de fila de la vista claim_rejections.
export type ClaimRejection = Database["public"]["Views"]["claim_rejections"]["Row"];

// Repositorio de operaciones (vistas y RPCs del modulo de operaciones).
// No extiende BaseRepository porque no opera sobre una tabla CRUD directa.
export class OperacionesRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  // Lista la carga de trabajo de todos los liquidadores activos.
  async getWorkload(): Promise<LiquidatorWorkload[]> {
    const { data, error } = await this.client
      .from("liquidator_workload")
      .select("*")
      .order("active_claims", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  // Lista los siniestros rechazados.
  async getRejections(): Promise<ClaimRejection[]> {
    const { data, error } = await this.client
      .from("claim_rejections")
      .select("*")
      .order("rejected_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  }

  // Reingresa un siniestro rechazado (reasigna automaticamente).
  async reingresarSiniestro(
    claimId: string,
    description?: string
  ): Promise<{ error: PostgrestError | null }> {
    const { error } = await this.client.rpc("reingresar_siniestro", {
      p_claim_id: claimId,
      p_description: description ?? undefined,
    });
    return { error };
  }

  // Anula un siniestro.
  async anularSiniestro(
    claimId: string,
    description?: string
  ): Promise<{ error: PostgrestError | null }> {
    const { error } = await this.client.rpc("anular_siniestro", {
      p_claim_id: claimId,
      p_description: description ?? undefined,
    });
    return { error };
  }
}

export const operacionesQueryKeys = {
  all: () => ["operaciones"] as const,
  workload: () => [...operacionesQueryKeys.all(), "workload"] as const,
  rejections: () => [...operacionesQueryKeys.all(), "rejections"] as const,
};
