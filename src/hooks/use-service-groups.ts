"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ServiceGroupsRepository, serviceGroupsQueryKeys } from "@/repositories/service-groups.repository";
import type { ServiceGroupInput } from "@/schemas/service-group.schema";
import type { ServiceGroup } from "@/types";

function useServiceGroupsRepo() {
  const client = createSupabaseBrowserClient();
  return new ServiceGroupsRepository(client);
}

export function useServiceGroups() {
  const repo = useServiceGroupsRepo();
  return useQuery({
    queryKey: serviceGroupsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useCreateServiceGroup() {
  const qc = useQueryClient();
  const repo = useServiceGroupsRepo();
  return useMutation({
    mutationFn: async (input: ServiceGroupInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ServiceGroup;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceGroupsQueryKeys.all() });
    },
  });
}

export function useUpdateServiceGroup() {
  const qc = useQueryClient();
  const repo = useServiceGroupsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ServiceGroupInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ServiceGroup;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceGroupsQueryKeys.all() });
    },
  });
}

export function useDeleteServiceGroup() {
  const qc = useQueryClient();
  const repo = useServiceGroupsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceGroupsQueryKeys.all() });
    },
  });
}
