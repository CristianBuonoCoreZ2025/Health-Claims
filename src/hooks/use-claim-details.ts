"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ClaimDetailsRepository,
  claimDetailsQueryKeys,
} from "@/repositories/claim-details.repository";
import type { ClaimDetailInput } from "@/schemas/claim-detail.schema";
import type { ClaimDetail } from "@/types";

// Hook cliente para obtener el repositorio de claim details con el browser client.
function useClaimDetailsRepo() {
  const client = createSupabaseBrowserClient();
  return new ClaimDetailsRepository(client);
}

// Lista los detalles de un claim.
export function useClaimDetails(claimId: string) {
  const repo = useClaimDetailsRepo();
  return useQuery({
    queryKey: claimDetailsQueryKeys.byClaim(claimId),
    enabled: Boolean(claimId),
    queryFn: async () => repo.getByClaim(claimId),
  });
}

// Obtiene un detalle de claim con sus relaciones.
export function useClaimDetailWithRelations(id: string) {
  const repo = useClaimDetailsRepo();
  return useQuery({
    queryKey: claimDetailsQueryKeys.withRelations(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.getWithRelations(id);
      if (error) throw error;
      return data;
    },
  });
}

// Crea un detalle de claim.
export function useCreateClaimDetail() {
  const qc = useQueryClient();
  const repo = useClaimDetailsRepo();
  return useMutation({
    mutationFn: async (input: ClaimDetailInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ClaimDetail;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimDetailsQueryKeys.all() });
    },
  });
}

// Actualiza un detalle de claim.
export function useUpdateClaimDetail() {
  const qc = useQueryClient();
  const repo = useClaimDetailsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ClaimDetailInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ClaimDetail;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimDetailsQueryKeys.all() });
    },
  });
}

// Elimina un detalle de claim (hard delete).
export function useDeleteClaimDetail() {
  const qc = useQueryClient();
  const repo = useClaimDetailsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimDetailsQueryKeys.all() });
    },
  });
}
