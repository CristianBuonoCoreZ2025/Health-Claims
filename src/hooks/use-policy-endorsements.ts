"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PolicyEndorsementsRepository, policyEndorsementsQueryKeys } from "@/repositories/policy-endorsements.repository";
import type { PolicyEndorsementInput } from "@/schemas/policy-endorsement.schema";
import type { PolicyEndorsement } from "@/types";

function usePolicyEndorsementsRepo() {
  const client = createSupabaseBrowserClient();
  return new PolicyEndorsementsRepository(client);
}

export function usePolicyEndorsements() {
  const repo = usePolicyEndorsementsRepo();
  return useQuery({
    queryKey: policyEndorsementsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function usePolicyEndorsementsByPolicy(policyId: string) {
  const repo = usePolicyEndorsementsRepo();
  return useQuery({
    queryKey: policyEndorsementsQueryKeys.byPolicy(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => repo.listByPolicy(policyId),
  });
}

export function useSearchPolicyEndorsementsByNumber(number: string) {
  const repo = usePolicyEndorsementsRepo();
  return useQuery({
    queryKey: policyEndorsementsQueryKeys.searchByNumber(number),
    enabled: number.length > 0,
    queryFn: async () => repo.searchByNumber(number),
  });
}

export function useCreatePolicyEndorsement() {
  const qc = useQueryClient();
  const repo = usePolicyEndorsementsRepo();
  return useMutation({
    mutationFn: async (input: PolicyEndorsementInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as PolicyEndorsement;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyEndorsementsQueryKeys.all() });
    },
  });
}

export function useUpdatePolicyEndorsement() {
  const qc = useQueryClient();
  const repo = usePolicyEndorsementsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PolicyEndorsementInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as PolicyEndorsement;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyEndorsementsQueryKeys.all() });
    },
  });
}

export function useDeletePolicyEndorsement() {
  const qc = useQueryClient();
  const repo = usePolicyEndorsementsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyEndorsementsQueryKeys.all() });
    },
  });
}
