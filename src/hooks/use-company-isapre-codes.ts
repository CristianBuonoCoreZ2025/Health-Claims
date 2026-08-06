"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CompanyIsapreCodesRepository, companyIsapreCodesQueryKeys } from "@/repositories/company-isapre-codes.repository";
import type { CompanyIsapreCodeInput } from "@/schemas/company-isapre-code.schema";
import type { CompanyIsapreCode } from "@/types";

export function useCompanyIsapreCodes() {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyIsapreCodesRepository(client);
  return useQuery({
    queryKey: companyIsapreCodesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function useCompanyIsapreCodesByCompany(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new CompanyIsapreCodesRepository(client);
  return useQuery({
    queryKey: companyIsapreCodesQueryKeys.byCompany(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByCompany(parentId),
  });
}


export function useCreateCompanyIsapreCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyIsapreCodesRepository(client);
  return useMutation({
    mutationFn: async (input: CompanyIsapreCodeInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as CompanyIsapreCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyIsapreCodesQueryKeys.all() });
    },
  });
}

export function useUpdateCompanyIsapreCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyIsapreCodesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CompanyIsapreCodeInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as CompanyIsapreCode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyIsapreCodesQueryKeys.all() });
    },
  });
}

export function useDeleteCompanyIsapreCode() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CompanyIsapreCodesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companyIsapreCodesQueryKeys.all() });
    },
  });
}
