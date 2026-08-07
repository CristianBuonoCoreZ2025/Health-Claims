"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ServiceItemsRepository, serviceItemsQueryKeys } from "@/repositories/service-items.repository";
import type { ServiceItemInput } from "@/schemas/service-item.schema";
import type { ServiceItem } from "@/types";

function useServiceItemsRepo() {
  const client = createSupabaseBrowserClient();
  return new ServiceItemsRepository(client);
}

export function useServiceItems() {
  const repo = useServiceItemsRepo();
  return useQuery({
    queryKey: serviceItemsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useServiceItemsBySubgroup(subgroupId: string) {
  const repo = useServiceItemsRepo();
  return useQuery({
    queryKey: serviceItemsQueryKeys.bySubgroup(subgroupId),
    enabled: Boolean(subgroupId),
    queryFn: async () => repo.listBySubgroup(subgroupId),
  });
}

export function useCreateServiceItem() {
  const qc = useQueryClient();
  const repo = useServiceItemsRepo();
  return useMutation({
    mutationFn: async (input: ServiceItemInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ServiceItem;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceItemsQueryKeys.all() });
    },
  });
}

export function useUpdateServiceItem() {
  const qc = useQueryClient();
  const repo = useServiceItemsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ServiceItemInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ServiceItem;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceItemsQueryKeys.all() });
    },
  });
}

export function useDeleteServiceItem() {
  const qc = useQueryClient();
  const repo = useServiceItemsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceItemsQueryKeys.all() });
    },
  });
}
