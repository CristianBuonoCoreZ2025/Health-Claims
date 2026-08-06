"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CompanyProviderCodesRepository, companyProviderCodesQueryKeys } from "@/repositories/company-provider-codes.repository";
import type { CompanyProviderCodeInput } from "@/schemas/company-provider-code.schema";
import type { CompanyProviderCode } from "@/types";

export function useCompanyProviderCodes() {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyProviderCodesRepository(client);
  return useQuery({
    queryKey: companyProviderCodesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function useCompanyProviderCodesByCompany(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyProviderCodesRepository(client);
  return useQuery({
    queryKey: companyProviderCodesQueryKeys.byCompany(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByCompany(parentId),
  });
}


export function useCreateCompanyProviderCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyProviderCodesRepository(client);
  return useMutation({
    mutationFn: async (input: CompanyProviderCodeInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as CompanyProviderCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyProviderCodesQueryKeys.all() });
    },
  });
}

export function useUpdateCompanyProviderCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyProviderCodesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CompanyProviderCodeInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as CompanyProviderCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyProviderCodesQueryKeys.all() });
    },
  });
}

export function useDeleteCompanyProviderCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyProviderCodesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyProviderCodesQueryKeys.all() });
    },
  });
}
