"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LiquidatorWeightsRepository,
  liquidatorWeightsQueryKeys,
} from "@/repositories/liquidator-weights.repository";
import type { LiquidatorWeightInput } from "@/schemas/liquidator-weight.schema";
import type { LiquidatorWeight } from "@/types";

// Hook cliente para obtener el repositorio de liquidator weights con el browser client.
function useLiquidatorWeightsRepo() {
  const client = createSupabaseBrowserClient();
  return new LiquidatorWeightsRepository(client);
}

// Lista los pesos de un liquidador por usuario.
export function useLiquidatorWeightsByUser(userId: string) {
  const repo = useLiquidatorWeightsRepo();
  return useQuery({
    queryKey: liquidatorWeightsQueryKeys.byUser(userId),
    enabled: Boolean(userId),
    queryFn: async () => repo.getByUser(userId),
  });
}

// Lista los pesos por tipo de cobertura.
export function useLiquidatorWeightsByCoverage(coverageTypeId: string) {
  const repo = useLiquidatorWeightsRepo();
  return useQuery({
    queryKey: liquidatorWeightsQueryKeys.byCoverage(coverageTypeId),
    enabled: Boolean(coverageTypeId),
    queryFn: async () => repo.getByCoverage(coverageTypeId),
  });
}

// Crea un peso de liquidador.
export function useCreateLiquidatorWeight() {
  const qc = useQueryClient();
  const repo = useLiquidatorWeightsRepo();
  return useMutation({
    mutationFn: async (input: LiquidatorWeightInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as LiquidatorWeight;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorWeightsQueryKeys.all() });
    },
  });
}

// Actualiza un peso de liquidador.
export function useUpdateLiquidatorWeight() {
  const qc = useQueryClient();
  const repo = useLiquidatorWeightsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<LiquidatorWeightInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as LiquidatorWeight;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorWeightsQueryKeys.all() });
    },
  });
}

// Elimina un peso de liquidador.
export function useDeleteLiquidatorWeight() {
  const qc = useQueryClient();
  const repo = useLiquidatorWeightsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorWeightsQueryKeys.all() });
    },
  });
}
