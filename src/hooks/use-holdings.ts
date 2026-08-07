"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { HoldingsRepository, holdingsQueryKeys } from "@/repositories/holdings.repository";
import type { HoldingInput } from "@/schemas/holding.schema";
import type { Holding } from "@/types";

function useHoldingsRepo() {
  const client = createSupabaseBrowserClient();
  return new HoldingsRepository(client);
}

export function useHoldings() {
  const repo = useHoldingsRepo();
  return useQuery({
    queryKey: holdingsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchHoldingsByBusinessName(name: string) {
  const repo = useHoldingsRepo();
  return useQuery({
    queryKey: holdingsQueryKeys.searchByBusinessName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByBusinessName(name),
  });
}

export function useSearchHoldingsByRut(rut: string) {
  const repo = useHoldingsRepo();
  return useQuery({
    queryKey: holdingsQueryKeys.searchByRut(rut),
    enabled: rut.length > 0,
    queryFn: async () => repo.searchByRut(rut),
  });
}

export function useCreateHolding() {
  const qc = useQueryClient();
  const repo = useHoldingsRepo();
  return useMutation({
    mutationFn: async (input: HoldingInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Holding;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: holdingsQueryKeys.all() });
    },
  });
}

export function useUpdateHolding() {
  const qc = useQueryClient();
  const repo = useHoldingsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<HoldingInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Holding;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: holdingsQueryKeys.all() });
    },
  });
}

export function useDeleteHolding() {
  const qc = useQueryClient();
  const repo = useHoldingsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: holdingsQueryKeys.all() });
    },
  });
}
