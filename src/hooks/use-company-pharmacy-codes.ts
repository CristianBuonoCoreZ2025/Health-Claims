"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CompanyPharmacyCodesRepository, companyPharmacyCodesQueryKeys } from "@/repositories/company-pharmacy-codes.repository";
import type { CompanyPharmacyCodeInput } from "@/schemas/company-pharmacy-code.schema";
import type { CompanyPharmacyCode } from "@/types";

export function useCompanyPharmacyCodes() {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyPharmacyCodesRepository(client);
  return useQuery({
    queryKey: companyPharmacyCodesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function useCompanyPharmacyCodesByCompany(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyPharmacyCodesRepository(client);
  return useQuery({
    queryKey: companyPharmacyCodesQueryKeys.byCompany(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByCompany(parentId),
  });
}


export function useCreateCompanyPharmacyCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyPharmacyCodesRepository(client);
  return useMutation({
    mutationFn: async (input: CompanyPharmacyCodeInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as CompanyPharmacyCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyPharmacyCodesQueryKeys.all() });
    },
  });
}

export function useUpdateCompanyPharmacyCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyPharmacyCodesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CompanyPharmacyCodeInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as CompanyPharmacyCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyPharmacyCodesQueryKeys.all() });
    },
  });
}

export function useDeleteCompanyPharmacyCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyPharmacyCodesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyPharmacyCodesQueryKeys.all() });
    },
  });
}
