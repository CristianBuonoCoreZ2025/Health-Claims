"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CompanyBranchesRepository, companyBranchesQueryKeys } from "@/repositories/company-branches.repository";
import type { CompanyBranchInput } from "@/schemas/company-branch.schema";
import type { CompanyBranch } from "@/types";

function useCompanyBranchesRepo() {
  const client = createSupabaseBrowserClient();
  return new CompanyBranchesRepository(client);
}

export function useCompanyBranches() {
  const repo = useCompanyBranchesRepo();
  return useQuery({
    queryKey: companyBranchesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useCompanyBranchesByCompany(companyId: string) {
  const repo = useCompanyBranchesRepo();
  return useQuery({
    queryKey: companyBranchesQueryKeys.byCompany(companyId),
    enabled: Boolean(companyId),
    queryFn: async () => repo.listByCompany(companyId),
  });
}

export function useSearchCompanyBranchesByName(name: string) {
  const repo = useCompanyBranchesRepo();
  return useQuery({
    queryKey: companyBranchesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateCompanyBranch() {
  const qc = useQueryClient();
  const repo = useCompanyBranchesRepo();
  return useMutation({
    mutationFn: async (input: CompanyBranchInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as CompanyBranch;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyBranchesQueryKeys.all() });
    },
  });
}

export function useUpdateCompanyBranch() {
  const qc = useQueryClient();
  const repo = useCompanyBranchesRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CompanyBranchInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as CompanyBranch;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyBranchesQueryKeys.all() });
    },
  });
}

export function useDeleteCompanyBranch() {
  const qc = useQueryClient();
  const repo = useCompanyBranchesRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyBranchesQueryKeys.all() });
    },
  });
}
