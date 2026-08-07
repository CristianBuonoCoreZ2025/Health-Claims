"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ContractorsRepository, contractorsQueryKeys } from "@/repositories/contractors.repository";
import type { ContractorInput } from "@/schemas/contractor.schema";
import type { Contractor } from "@/types";

function useContractorsRepo() {
  const client = createSupabaseBrowserClient();
  return new ContractorsRepository(client);
}

export function useContractors() {
  const repo = useContractorsRepo();
  return useQuery({
    queryKey: contractorsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useContractorsByHolding(holdingId: string) {
  const repo = useContractorsRepo();
  return useQuery({
    queryKey: contractorsQueryKeys.byHolding(holdingId),
    enabled: Boolean(holdingId),
    queryFn: async () => repo.listByHolding(holdingId),
  });
}

export function useSearchContractorsByName(name: string) {
  const repo = useContractorsRepo();
  return useQuery({
    queryKey: contractorsQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateContractor() {
  const qc = useQueryClient();
  const repo = useContractorsRepo();
  return useMutation({
    mutationFn: async (input: ContractorInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Contractor;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: contractorsQueryKeys.all() });
    },
  });
}

export function useUpdateContractor() {
  const qc = useQueryClient();
  const repo = useContractorsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ContractorInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Contractor;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: contractorsQueryKeys.all() });
    },
  });
}

export function useDeleteContractor() {
  const qc = useQueryClient();
  const repo = useContractorsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: contractorsQueryKeys.all() });
    },
  });
}
