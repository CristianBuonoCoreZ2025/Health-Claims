"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  CoverageTypesRepository,
  coverageTypesQueryKeys,
} from "@/repositories/coverage-types.repository";
import type { CoverageTypeInput } from "@/schemas/coverage-type.schema";
import type { CoverageType } from "@/types";

// Hook cliente para obtener el repositorio de coverage_types con el browser client.
function useCoverageTypesRepo() {
  const client = createSupabaseBrowserClient();
  return new CoverageTypesRepository(client);
}

// Lista todos los tipos de cobertura activos.
export function useCoverageTypes() {
  const repo = useCoverageTypesRepo();
  return useQuery({
    queryKey: coverageTypesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

// Crea un tipo de cobertura.
export function useCreateCoverageType() {
  const qc = useQueryClient();
  const repo = useCoverageTypesRepo();
  return useMutation({
    mutationFn: async (input: CoverageTypeInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as CoverageType;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: coverageTypesQueryKeys.all() });
    },
  });
}

// Actualiza un tipo de cobertura.
export function useUpdateCoverageType() {
  const qc = useQueryClient();
  const repo = useCoverageTypesRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CoverageTypeInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as CoverageType;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: coverageTypesQueryKeys.all() });
    },
  });
}

// Desactiva un tipo de cobertura (soft delete).
export function useDeleteCoverageType() {
  const qc = useQueryClient();
  const repo = useCoverageTypesRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: coverageTypesQueryKeys.all() });
    },
  });
}
