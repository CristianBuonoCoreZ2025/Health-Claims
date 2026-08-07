"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ClaimDispatchesRepository, claimDispatchesQueryKeys } from "@/repositories/claim-dispatches.repository";
import type { ClaimDispatchInput } from "@/schemas/claim-dispatch.schema";
import type { ClaimDispatch } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new ClaimDispatchesRepository(client);
}

export function useClaimDispatches(claimId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: claimDispatchesQueryKeys.byClaim(claimId),
    enabled: Boolean(claimId),
    queryFn: async () => repo.getByClaim(claimId),
  });
}

export function useCreateClaimDispatch() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: ClaimDispatchInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ClaimDispatch;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimDispatchesQueryKeys.all() });
    },
  });
}

export function useUpdateClaimDispatch() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ClaimDispatchInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ClaimDispatch;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimDispatchesQueryKeys.all() });
    },
  });
}

export function useDeleteClaimDispatch() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimDispatchesQueryKeys.all() });
    },
  });
}
