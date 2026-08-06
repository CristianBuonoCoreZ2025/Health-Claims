"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  PolicyConditionsRepository,
  policyConditionsQueryKeys,
} from "@/repositories/policy-conditions.repository";
import type { PolicyConditionInput } from "@/schemas/policy-condition.schema";
import type { PolicyCondition } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new PolicyConditionsRepository(client);
}

export function usePolicyConditions(policyId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: policyConditionsQueryKeys.byPolicy(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => repo.getByPolicy(policyId),
  });
}

export function useCreatePolicyCondition() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: PolicyConditionInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as PolicyCondition;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionsQueryKeys.all() });
    },
  });
}

export function useUpdatePolicyCondition() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PolicyConditionInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as PolicyCondition;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionsQueryKeys.all() });
    },
  });
}

export function useDeletePolicyCondition() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionsQueryKeys.all() });
    },
  });
}

export function useSyncPolicyConditions() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({
      policyId,
      conditions,
    }: {
      policyId: string;
      conditions: PolicyConditionInput[];
    }) => {
      await repo.syncPolicyConditions(policyId, conditions);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionsQueryKeys.all() });
    },
  });
}
