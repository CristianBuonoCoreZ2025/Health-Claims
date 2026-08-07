"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LiquidatorCompetenciesRepository,
  liquidatorCompetenciesQueryKeys,
} from "@/repositories/liquidator-competencies.repository";
import type { LiquidatorCompetencyInput } from "@/schemas/liquidator-competency.schema";
import type { LiquidatorCompetency } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new LiquidatorCompetenciesRepository(client);
}

export function useLiquidatorCompetencies() {
  const repo = useRepo();
  return useQuery({
    queryKey: liquidatorCompetenciesQueryKeys.all(),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateLiquidatorCompetency() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: LiquidatorCompetencyInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as LiquidatorCompetency;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorCompetenciesQueryKeys.all() });
    },
  });
}

export function useUpdateLiquidatorCompetency() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<LiquidatorCompetencyInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as LiquidatorCompetency;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorCompetenciesQueryKeys.all() });
    },
  });
}

export function useDeleteLiquidatorCompetency() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorCompetenciesQueryKeys.all() });
    },
  });
}
