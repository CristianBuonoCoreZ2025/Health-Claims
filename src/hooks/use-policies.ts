"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PoliciesRepository, policiesQueryKeys } from "@/repositories/policies.repository";
import type { PolicyInput } from "@/schemas/policy.schema";
import type { Policy, PolicyStatus } from "@/types";

function usePoliciesRepo() {
  const client = createSupabaseBrowserClient();
  return new PoliciesRepository(client);
}

export function usePolicies() {
  const repo = usePoliciesRepo();
  return useQuery({
    queryKey: policiesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function usePoliciesByCompany(companyId: string) {
  const repo = usePoliciesRepo();
  return useQuery({
    queryKey: policiesQueryKeys.byCompany(companyId),
    enabled: Boolean(companyId),
    queryFn: async () => repo.getByCompany(companyId),
  });
}

export function usePoliciesByStatus(status: PolicyStatus) {
  const repo = usePoliciesRepo();
  return useQuery({
    queryKey: policiesQueryKeys.byStatus(status),
    queryFn: async () => repo.getByStatus(status),
  });
}

export function useSearchPoliciesByNumber(number: string) {
  const repo = usePoliciesRepo();
  return useQuery({
    queryKey: policiesQueryKeys.list({ search: number }),
    enabled: number.length > 0,
    queryFn: async () => repo.searchByNumber(number),
  });
}

export function usePolicyDetail(id: string) {
  const repo = usePoliciesRepo();
  return useQuery({
    queryKey: policiesQueryKeys.detail(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.findById(id);
      if (error) throw error;
      return data;
    },
  });
}

export function usePolicyWithCompany(id: string) {
  const repo = usePoliciesRepo();
  return useQuery({
    queryKey: policiesQueryKeys.withCompany(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.getWithCompany(id);
      if (error) throw error;
      return data;
    },
  });
}

export function usePolicyWithConditions(id: string) {
  const repo = usePoliciesRepo();
  return useQuery({
    queryKey: policiesQueryKeys.withConditions(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.getWithConditions(id);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePolicy() {
  const qc = useQueryClient();
  const repo = usePoliciesRepo();
  return useMutation({
    mutationFn: async (input: PolicyInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Policy;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policiesQueryKeys.all() });
    },
  });
}

export function useUpdatePolicy() {
  const qc = useQueryClient();
  const repo = usePoliciesRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PolicyInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Policy;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policiesQueryKeys.all() });
    },
  });
}

export function useDeletePolicy() {
  const qc = useQueryClient();
  const repo = usePoliciesRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policiesQueryKeys.all() });
    },
  });
}
