"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LiquidatorLoadCapsRepository,
  liquidatorLoadCapsQueryKeys,
} from "@/repositories/liquidator-load-caps.repository";
import type { LiquidatorLoadCapInput } from "@/schemas/liquidator-load-cap.schema";
import type { LiquidatorLoadCap } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new LiquidatorLoadCapsRepository(client);
}

export function useLiquidatorLoadCaps() {
  const repo = useRepo();
  return useQuery({
    queryKey: liquidatorLoadCapsQueryKeys.all(),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateLiquidatorLoadCap() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: LiquidatorLoadCapInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as LiquidatorLoadCap;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorLoadCapsQueryKeys.all() });
    },
  });
}

export function useUpdateLiquidatorLoadCap() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<LiquidatorLoadCapInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as LiquidatorLoadCap;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorLoadCapsQueryKeys.all() });
    },
  });
}

export function useDeleteLiquidatorLoadCap() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorLoadCapsQueryKeys.all() });
    },
  });
}
