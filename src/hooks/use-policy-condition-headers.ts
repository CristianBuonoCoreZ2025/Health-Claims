"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PolicyConditionHeadersRepository, policyConditionHeadersQueryKeys } from "@/repositories/policy-condition-headers.repository";
import type { PolicyConditionHeaderInput } from "@/schemas/policy-condition-header.schema";
import type { PolicyConditionHeader } from "@/types";

function usePolicyConditionHeadersRepo() {
  const client = createSupabaseBrowserClient();
  return new PolicyConditionHeadersRepository(client);
}

export function usePolicyConditionHeaders() {
  const repo = usePolicyConditionHeadersRepo();
  return useQuery({
    queryKey: policyConditionHeadersQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function usePolicyConditionHeadersByPolicy(policyId: string) {
  const repo = usePolicyConditionHeadersRepo();
  return useQuery({
    queryKey: policyConditionHeadersQueryKeys.byPolicy(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => repo.listByPolicy(policyId),
  });
}

export function useCreatePolicyConditionHeader() {
  const qc = useQueryClient();
  const repo = usePolicyConditionHeadersRepo();
  return useMutation({
    mutationFn: async (input: PolicyConditionHeaderInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as PolicyConditionHeader;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionHeadersQueryKeys.all() });
    },
  });
}

export function useUpdatePolicyConditionHeader() {
  const qc = useQueryClient();
  const repo = usePolicyConditionHeadersRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PolicyConditionHeaderInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as PolicyConditionHeader;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionHeadersQueryKeys.all() });
    },
  });
}

export function useDeletePolicyConditionHeader() {
  const qc = useQueryClient();
  const repo = usePolicyConditionHeadersRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionHeadersQueryKeys.all() });
    },
  });
}
