"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { SpecialtiesRepository, specialtiesQueryKeys } from "@/repositories/specialties.repository";
import type { SpecialtyInput } from "@/schemas/specialty.schema";
import type { Specialty } from "@/types";

export function useSpecialties() {
  const client = createSupabaseBrowserClient();
  const repo = new SpecialtiesRepository(client);
  return useQuery({
    queryKey: specialtiesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchSpecialtiesByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new SpecialtiesRepository(client);
  return useQuery({
    queryKey: specialtiesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateSpecialty() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new SpecialtiesRepository(client);
  return useMutation({
    mutationFn: async (input: SpecialtyInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Specialty;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: specialtiesQueryKeys.all() });
    },
  });
}

export function useUpdateSpecialty() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new SpecialtiesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<SpecialtyInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Specialty;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: specialtiesQueryKeys.all() });
    },
  });
}

export function useDeleteSpecialty() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new SpecialtiesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: specialtiesQueryKeys.all() });
    },
  });
}
