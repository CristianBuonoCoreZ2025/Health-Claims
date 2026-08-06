"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { IsaprePlansRepository, isaprePlansQueryKeys } from "@/repositories/isapre-plans.repository";
import type { IsaprePlanInput } from "@/schemas/isapre-plan.schema";
import type { IsaprePlan } from "@/types";

export function useIsaprePlans() {
  const client = createSupabaseBrowserClient();
  const repo = new IsaprePlansRepository(client);
  return useQuery({
    queryKey: isaprePlansQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}
export function useIsaprePlansByIsapre(parentId: string) {
  const client = createSupabaseBrowserClient();
  const repo = new IsaprePlansRepository(client);
  return useQuery({
    queryKey: isaprePlansQueryKeys.byIsapre(parentId),
    enabled: !!parentId,
    queryFn: async () => repo.findByIsapre(parentId),
  });
}
export function useSearchIsaprePlansByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new IsaprePlansRepository(client);
  return useQuery({
    queryKey: isaprePlansQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateIsaprePlan() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new IsaprePlansRepository(client);
  return useMutation({
    mutationFn: async (input: IsaprePlanInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as IsaprePlan;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: isaprePlansQueryKeys.all() });
    },
  });
}

export function useUpdateIsaprePlan() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new IsaprePlansRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<IsaprePlanInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as IsaprePlan;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: isaprePlansQueryKeys.all() });
    },
  });
}

export function useDeleteIsaprePlan() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new IsaprePlansRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: isaprePlansQueryKeys.all() });
    },
  });
}
