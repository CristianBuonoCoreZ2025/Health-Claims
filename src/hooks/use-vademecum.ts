"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { VademecumRepository, vademecumQueryKeys } from "@/repositories/vademecum.repository";
import type { VademecumInput } from "@/schemas/vademecum.schema";
import type { Vademecum } from "@/types";

export function useVademecum() {
  const client = createSupabaseBrowserClient();
  const repo = new VademecumRepository(client);
  return useQuery({
    queryKey: vademecumQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function useVademecumByLaboratory(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new VademecumRepository(client);
  return useQuery({
    queryKey: vademecumQueryKeys.byLaboratory(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByLaboratory(parentId),
  });
}
export function useSearchVademecumByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new VademecumRepository(client);
  return useQuery({
    queryKey: vademecumQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateVademecum() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new VademecumRepository(client);
  return useMutation({
    mutationFn: async (input: VademecumInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Vademecum;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: vademecumQueryKeys.all() });
    },
  });
}

export function useUpdateVademecum() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new VademecumRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<VademecumInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Vademecum;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: vademecumQueryKeys.all() });
    },
  });
}

export function useDeleteVademecum() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new VademecumRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: vademecumQueryKeys.all() });
    },
  });
}
