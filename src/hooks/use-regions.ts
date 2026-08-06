"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { RegionsRepository, regionsQueryKeys } from "@/repositories/regions.repository";
import type { RegionInput } from "@/schemas/region.schema";
import type { Region } from "@/types";

export function useRegions() {
  const client = createSupabaseBrowserClient();
  const repo = new RegionsRepository(client);
  return useQuery({
    queryKey: regionsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function useRegionsByCountry(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new RegionsRepository(client);
  return useQuery({
    queryKey: regionsQueryKeys.byCountry(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByCountry(parentId),
  });
}
export function useSearchRegionsByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new RegionsRepository(client);
  return useQuery({
    queryKey: regionsQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateRegion() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new RegionsRepository(client);
  return useMutation({
    mutationFn: async (input: RegionInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Region;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: regionsQueryKeys.all() });
    },
  });
}

export function useUpdateRegion() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new RegionsRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<RegionInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Region;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: regionsQueryKeys.all() });
    },
  });
}

export function useDeleteRegion() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new RegionsRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: regionsQueryKeys.all() });
    },
  });
}
