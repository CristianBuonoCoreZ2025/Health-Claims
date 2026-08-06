"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ClaimsRepository, claimsQueryKeys } from "@/repositories/claims.repository";
import type { ClaimInput } from "@/schemas/claim.schema";
import type { Claim, ClaimStatus } from "@/types";

// Hook cliente para obtener el repositorio de claims con el browser client.
function useClaimsRepo() {
  const client = createSupabaseBrowserClient();
  return new ClaimsRepository(client);
}

// Lista los claims recientes (limite 50).
export function useClaims() {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.recent(),
    queryFn: async () => repo.listRecent(50),
  });
}

// Lista claims por estado.
export function useClaimsByStatus(status: ClaimStatus) {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.byStatus(status),
    queryFn: async () => repo.getByStatus(status),
  });
}

// Lista claims por liquidador.
export function useClaimsByLiquidator(liquidatorId: string) {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.byLiquidator(liquidatorId),
    enabled: Boolean(liquidatorId),
    queryFn: async () => repo.getByLiquidator(liquidatorId),
  });
}

// Lista claims por poliza.
export function useClaimsByPolicy(policyId: string) {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.byPolicy(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => repo.getByPolicy(policyId),
  });
}

// Lista claims por asegurado.
export function useClaimsByInsured(insuredId: string) {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.byInsured(insuredId),
    enabled: Boolean(insuredId),
    queryFn: async () => repo.getByInsured(insuredId),
  });
}

// Busca claims por numero.
export function useSearchClaimsByNumber(number: string) {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.list({ search: number }),
    enabled: number.length > 0,
    queryFn: async () => repo.searchByNumber(number),
  });
}

// Obtiene el detalle de un claim por id.
export function useClaimDetail(id: string) {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.detail(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.findById(id);
      if (error) throw error;
      return data;
    },
  });
}

// Obtiene un claim con sus relaciones.
export function useClaimWithRelations(id: string) {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.withRelations(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.getWithRelations(id);
      if (error) throw error;
      return data;
    },
  });
}

// Obtiene un claim con su timeline.
export function useClaimWithTimeline(id: string) {
  const repo = useClaimsRepo();
  return useQuery({
    queryKey: claimsQueryKeys.withTimeline(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.getWithTimeline(id);
      if (error) throw error;
      return data;
    },
  });
}

// Crea un claim.
export function useCreateClaim() {
  const qc = useQueryClient();
  const repo = useClaimsRepo();
  return useMutation({
    mutationFn: async (input: ClaimInput) => {
      const payload = { ...input, claim_number: input.claim_number ?? "" };
      const { data, error } = await repo.insert(payload);
      if (error) throw error;
      return data as Claim;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimsQueryKeys.all() });
    },
  });
}

// Actualiza un claim.
export function useUpdateClaim() {
  const qc = useQueryClient();
  const repo = useClaimsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ClaimInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Claim;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimsQueryKeys.all() });
    },
  });
}

// Desactiva un claim (soft delete).
export function useDeleteClaim() {
  const qc = useQueryClient();
  const repo = useClaimsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimsQueryKeys.all() });
    },
  });
}
