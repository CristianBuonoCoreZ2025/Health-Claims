"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PendingReasonsRepository, pendingReasonsQueryKeys } from "@/repositories/pending-reasons.repository";
import type { PendingReasonInput } from "@/schemas/pending-reason.schema";
import type { PendingReason } from "@/types";

export function usePendingReasons() {
  const client = createSupabaseBrowserClient();
  const repo = new PendingReasonsRepository(client);
  return useQuery({
    queryKey: pendingReasonsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchPendingReasonsByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new PendingReasonsRepository(client);
  return useQuery({
    queryKey: pendingReasonsQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreatePendingReason() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PendingReasonsRepository(client);
  return useMutation({
    mutationFn: async (input: PendingReasonInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as PendingReason;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: pendingReasonsQueryKeys.all() });
    },
  });
}

export function useUpdatePendingReason() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PendingReasonsRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PendingReasonInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as PendingReason;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: pendingReasonsQueryKeys.all() });
    },
  });
}

export function useDeletePendingReason() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PendingReasonsRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: pendingReasonsQueryKeys.all() });
    },
  });
}
