"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ProviderCoveragesRepository,
  providerCoveragesQueryKeys,
} from "@/repositories/provider-coverages.repository";

// Hook cliente para obtener el repositorio de provider_coverages con el browser client.
function useProviderCoveragesRepo() {
  const client = createSupabaseBrowserClient();
  return new ProviderCoveragesRepository(client);
}

// Obtiene las coberturas de un proveedor dado su providerId.
export function useProviderCoverages(providerId: string | null) {
  const repo = useProviderCoveragesRepo();
  return useQuery({
    queryKey: providerCoveragesQueryKeys.byProvider(providerId ?? ""),
    enabled: Boolean(providerId),
    queryFn: async () => repo.getByProvider(providerId as string),
  });
}

// Sincroniza las coberturas de un proveedor (elimina las no incluidas e inserta las nuevas).
export function useSyncProviderCoverages() {
  const qc = useQueryClient();
  const repo = useProviderCoveragesRepo();
  return useMutation({
    mutationFn: async ({
      providerId,
      coverageTypeIds,
    }: {
      providerId: string;
      coverageTypeIds: string[];
    }) => {
      const { data, error } = await repo.syncProviderCoverages(providerId, coverageTypeIds);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: providerCoveragesQueryKeys.all() });
    },
  });
}
