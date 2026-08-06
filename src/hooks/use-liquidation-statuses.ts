"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LiquidationStatusesRepository, liquidationStatusesQueryKeys } from "@/repositories/liquidation-statuses.repository";
import type { LiquidationStatusInput } from "@/schemas/liquidation-status.schema";
import type { LiquidationStatus } from "@/types";

export function useLiquidationStatuses() {
  const client = createSupabaseBrowserClient();
  const repo = new LiquidationStatusesRepository(client);
  return useQuery({
    queryKey: liquidationStatusesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchLiquidationStatusesByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new LiquidationStatusesRepository(client);
  return useQuery({
    queryKey: liquidationStatusesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateLiquidationStatus() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new LiquidationStatusesRepository(client);
  return useMutation({
    mutationFn: async (input: LiquidationStatusInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as LiquidationStatus;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidationStatusesQueryKeys.all() });
    },
  });
}

export function useUpdateLiquidationStatus() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new LiquidationStatusesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<LiquidationStatusInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as LiquidationStatus;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidationStatusesQueryKeys.all() });
    },
  });
}

export function useDeleteLiquidationStatus() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new LiquidationStatusesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidationStatusesQueryKeys.all() });
    },
  });
}
