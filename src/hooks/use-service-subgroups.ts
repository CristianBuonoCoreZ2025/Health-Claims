"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ServiceSubgroupsRepository, serviceSubgroupsQueryKeys } from "@/repositories/service-subgroups.repository";
import type { ServiceSubgroupInput } from "@/schemas/service-subgroup.schema";
import type { ServiceSubgroup } from "@/types";

function useServiceSubgroupsRepo() {
  const client = createSupabaseBrowserClient();
  return new ServiceSubgroupsRepository(client);
}

export function useServiceSubgroups() {
  const repo = useServiceSubgroupsRepo();
  return useQuery({
    queryKey: serviceSubgroupsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useServiceSubgroupsByGroup(groupId: string) {
  const repo = useServiceSubgroupsRepo();
  return useQuery({
    queryKey: serviceSubgroupsQueryKeys.byGroup(groupId),
    enabled: Boolean(groupId),
    queryFn: async () => repo.listByGroup(groupId),
  });
}

export function useCreateServiceSubgroup() {
  const qc = useQueryClient();
  const repo = useServiceSubgroupsRepo();
  return useMutation({
    mutationFn: async (input: ServiceSubgroupInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ServiceSubgroup;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceSubgroupsQueryKeys.all() });
    },
  });
}

export function useUpdateServiceSubgroup() {
  const qc = useQueryClient();
  const repo = useServiceSubgroupsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ServiceSubgroupInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ServiceSubgroup;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceSubgroupsQueryKeys.all() });
    },
  });
}

export function useDeleteServiceSubgroup() {
  const qc = useQueryClient();
  const repo = useServiceSubgroupsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceSubgroupsQueryKeys.all() });
    },
  });
}
