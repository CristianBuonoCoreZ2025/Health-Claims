"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { InsuredsRepository, insuredsQueryKeys } from "@/repositories/insureds.repository";
import type { InsuredInput } from "@/schemas/insured.schema";
import type { Insured } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new InsuredsRepository(client);
}

export function useInsuredsByPolicy(policyId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: insuredsQueryKeys.byPolicy(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => repo.getByPolicy(policyId),
  });
}

export function useInsuredTitulares(policyId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: insuredsQueryKeys.titulares(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => repo.getTitulares(policyId),
  });
}

export function useInsuredCargas(policyId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: insuredsQueryKeys.cargas(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => repo.getCargas(policyId),
  });
}

export function useSearchInsuredsByRut(rut: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: insuredsQueryKeys.byRut(rut),
    enabled: rut.length > 0,
    queryFn: async () => repo.searchByRut(rut),
  });
}

export function useSearchInsuredsByName(name: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: insuredsQueryKeys.byName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useInsuredWithDetails(id: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: insuredsQueryKeys.withDetails(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.getWithDetails(id);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInsured() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: InsuredInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Insured;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: insuredsQueryKeys.all() });
    },
  });
}

export function useUpdateInsured() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<InsuredInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Insured;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: insuredsQueryKeys.all() });
    },
  });
}

export function useDeleteInsured() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: insuredsQueryKeys.all() });
    },
  });
}
