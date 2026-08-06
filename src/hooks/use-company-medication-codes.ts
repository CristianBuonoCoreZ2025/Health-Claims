"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CompanyMedicationCodesRepository, companyMedicationCodesQueryKeys } from "@/repositories/company-medication-codes.repository";
import type { CompanyMedicationCodeInput } from "@/schemas/company-medication-code.schema";
import type { CompanyMedicationCode } from "@/types";

export function useCompanyMedicationCodes() {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyMedicationCodesRepository(client);
  return useQuery({
    queryKey: companyMedicationCodesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function useCompanyMedicationCodesByCompany(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyMedicationCodesRepository(client);
  return useQuery({
    queryKey: companyMedicationCodesQueryKeys.byCompany(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByCompany(parentId),
  });
}


export function useCreateCompanyMedicationCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyMedicationCodesRepository(client);
  return useMutation({
    mutationFn: async (input: CompanyMedicationCodeInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as CompanyMedicationCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyMedicationCodesQueryKeys.all() });
    },
  });
}

export function useUpdateCompanyMedicationCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyMedicationCodesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CompanyMedicationCodeInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as CompanyMedicationCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyMedicationCodesQueryKeys.all() });
    },
  });
}

export function useDeleteCompanyMedicationCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyMedicationCodesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyMedicationCodesQueryKeys.all() });
    },
  });
}
