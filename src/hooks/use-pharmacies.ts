"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PharmaciesRepository, pharmaciesQueryKeys } from "@/repositories/pharmacies.repository";
import type { PharmacyInput } from "@/schemas/pharmacy.schema";
import type { Pharmacy } from "@/types";

export function usePharmacies() {
  const client = createSupabaseBrowserClient();
  const repo = new PharmaciesRepository(client);
  return useQuery({
    queryKey: pharmaciesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function usePharmaciesByProvider(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new PharmaciesRepository(client);
  return useQuery({
    queryKey: pharmaciesQueryKeys.byProvider(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByProvider(parentId),
  });
}
export function useSearchPharmaciesByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new PharmaciesRepository(client);
  return useQuery({
    queryKey: pharmaciesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreatePharmacy() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PharmaciesRepository(client);
  return useMutation({
    mutationFn: async (input: PharmacyInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Pharmacy;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: pharmaciesQueryKeys.all() });
    },
  });
}

export function useUpdatePharmacy() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PharmaciesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PharmacyInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Pharmacy;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: pharmaciesQueryKeys.all() });
    },
  });
}

export function useDeletePharmacy() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PharmaciesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: pharmaciesQueryKeys.all() });
    },
  });
}
