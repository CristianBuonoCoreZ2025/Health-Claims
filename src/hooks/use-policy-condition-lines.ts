"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PolicyConditionLinesRepository, policyConditionLinesQueryKeys } from "@/repositories/policy-condition-lines.repository";
import type { PolicyConditionLineInput } from "@/schemas/policy-condition-line.schema";
import type { PolicyConditionLine } from "@/types";

function usePolicyConditionLinesRepo() {
  const client = createSupabaseBrowserClient();
  return new PolicyConditionLinesRepository(client);
}

export function usePolicyConditionLines(headerId: string) {
  const repo = usePolicyConditionLinesRepo();
  return useQuery({
    queryKey: policyConditionLinesQueryKeys.byHeader(headerId),
    enabled: Boolean(headerId),
    queryFn: async () => repo.listByHeader(headerId),
  });
}

export function useCreatePolicyConditionLine() {
  const qc = useQueryClient();
  const repo = usePolicyConditionLinesRepo();
  return useMutation({
    mutationFn: async (input: PolicyConditionLineInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as PolicyConditionLine;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionLinesQueryKeys.all() });
    },
  });
}

export function useUpdatePolicyConditionLine() {
  const qc = useQueryClient();
  const repo = usePolicyConditionLinesRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PolicyConditionLineInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as PolicyConditionLine;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionLinesQueryKeys.all() });
    },
  });
}

export function useDeletePolicyConditionLine() {
  const qc = useQueryClient();
  const repo = usePolicyConditionLinesRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyConditionLinesQueryKeys.all() });
    },
  });
}
