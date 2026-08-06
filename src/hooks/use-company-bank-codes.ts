"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CompanyBankCodesRepository, companyBankCodesQueryKeys } from "@/repositories/company-bank-codes.repository";
import type { CompanyBankCodeInput } from "@/schemas/company-bank-code.schema";
import type { CompanyBankCode } from "@/types";

export function useCompanyBankCodes() {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyBankCodesRepository(client);
  return useQuery({
    queryKey: companyBankCodesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function useCompanyBankCodesByCompany(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyBankCodesRepository(client);
  return useQuery({
    queryKey: companyBankCodesQueryKeys.byCompany(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByCompany(parentId),
  });
}


export function useCreateCompanyBankCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyBankCodesRepository(client);
  return useMutation({
    mutationFn: async (input: CompanyBankCodeInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as CompanyBankCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyBankCodesQueryKeys.all() });
    },
  });
}

export function useUpdateCompanyBankCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyBankCodesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CompanyBankCodeInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as CompanyBankCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyBankCodesQueryKeys.all() });
    },
  });
}

export function useDeleteCompanyBankCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyBankCodesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyBankCodesQueryKeys.all() });
    },
  });
}
