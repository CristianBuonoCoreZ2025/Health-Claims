"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CompaniesRepository, companiesQueryKeys } from "@/repositories/companies.repository";
import type { CompanyInput } from "@/schemas/company.schema";
import type { Company } from "@/types";

// Hook cliente para obtener el repositorio de companies con el browser client.
function useCompaniesRepo() {
  const client = createSupabaseBrowserClient();
  return new CompaniesRepository(client);
}

// Lista todas las companias activas.
export function useCompanies() {
  const repo = useCompaniesRepo();
  return useQuery({
    queryKey: companiesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

// Busca companias por nombre.
export function useSearchCompaniesByName(name: string) {
  const repo = useCompaniesRepo();
  return useQuery({
    queryKey: companiesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

// Crea una compania.
export function useCreateCompany() {
  const qc = useQueryClient();
  const repo = useCompaniesRepo();
  return useMutation({
    mutationFn: async (input: CompanyInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Company;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companiesQueryKeys.all() });
    },
  });
}

// Actualiza una compania.
export function useUpdateCompany() {
  const qc = useQueryClient();
  const repo = useCompaniesRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CompanyInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Company;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companiesQueryKeys.all() });
    },
  });
}

// Desactiva una compania (soft delete).
export function useDeleteCompany() {
  const qc = useQueryClient();
  const repo = useCompaniesRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: companiesQueryKeys.all() });
    },
  });
}
