"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ProvidersRepository, providersQueryKeys } from "@/repositories/providers.repository";
import type { ProviderInput } from "@/schemas/provider.schema";
import type { Provider } from "@/types";

// Hook cliente para obtener el repositorio de providers con el browser client.
function useProvidersRepo() {
  const client = createSupabaseBrowserClient();
  return new ProvidersRepository(client);
}

// Lista todos los proveedores activos.
export function useProviders() {
  const repo = useProvidersRepo();
  return useQuery({
    queryKey: providersQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

// Busca proveedores por nombre.
export function useSearchProvidersByName(name: string) {
  const repo = useProvidersRepo();
  return useQuery({
    queryKey: providersQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

// Crea un proveedor.
export function useCreateProvider() {
  const qc = useQueryClient();
  const repo = useProvidersRepo();
  return useMutation({
    mutationFn: async (input: ProviderInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Provider;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providersQueryKeys.all() });
    },
  });
}

// Actualiza un proveedor.
export function useUpdateProvider() {
  const qc = useQueryClient();
  const repo = useProvidersRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ProviderInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Provider;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providersQueryKeys.all() });
    },
  });
}

// Desactiva un proveedor (soft delete).
export function useDeleteProvider() {
  const qc = useQueryClient();
  const repo = useProvidersRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providersQueryKeys.all() });
    },
  });
}
