"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { IsapresRepository, isapresQueryKeys } from "@/repositories/isapres.repository";
import type { IsapreInput } from "@/schemas/isapre.schema";
import type { Isapre } from "@/types";

export function useIsapres() {
  const client = createSupabaseBrowserClient();
  const repo = new IsapresRepository(client);
  return useQuery({
    queryKey: isapresQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchIsapresByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new IsapresRepository(client);
  return useQuery({
    queryKey: isapresQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateIsapre() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new IsapresRepository(client);
  return useMutation({
    mutationFn: async (input: IsapreInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Isapre;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: isapresQueryKeys.all() });
    },
  });
}

export function useUpdateIsapre() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new IsapresRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<IsapreInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Isapre;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: isapresQueryKeys.all() });
    },
  });
}

export function useDeleteIsapre() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new IsapresRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: isapresQueryKeys.all() });
    },
  });
}
