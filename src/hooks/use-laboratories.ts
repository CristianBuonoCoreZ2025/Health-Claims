"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LaboratoriesRepository, laboratoriesQueryKeys } from "@/repositories/laboratories.repository";
import type { LaboratoryInput } from "@/schemas/laboratory.schema";
import type { Laboratory } from "@/types";

export function useLaboratories() {
  const client = createSupabaseBrowserClient();
  const repo = new LaboratoriesRepository(client);
  return useQuery({
    queryKey: laboratoriesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchLaboratoriesByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new LaboratoriesRepository(client);
  return useQuery({
    queryKey: laboratoriesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateLaboratory() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new LaboratoriesRepository(client);
  return useMutation({
    mutationFn: async (input: LaboratoryInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Laboratory;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: laboratoriesQueryKeys.all() });
    },
  });
}

export function useUpdateLaboratory() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new LaboratoriesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<LaboratoryInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Laboratory;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: laboratoriesQueryKeys.all() });
    },
  });
}

export function useDeleteLaboratory() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new LaboratoriesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: laboratoriesQueryKeys.all() });
    },
  });
}
