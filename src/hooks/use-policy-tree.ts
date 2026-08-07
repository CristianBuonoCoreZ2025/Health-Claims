"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  PolicyTreeRepository,
  policyTreeQueryKeys,
} from "@/repositories/policy-tree.repository";
import type {
  PolicyTreeConditionInput,
  PolicyTreeNodeInput,
} from "@/schemas/policy-tree.schema";
import type { Json, PolicyTreeCondition, PolicyTreeNode } from "@/types";

function usePolicyTreeRepo() {
  const client = createSupabaseBrowserClient();
  return new PolicyTreeRepository(client);
}

export function usePolicyTree(policyId: string) {
  const repo = usePolicyTreeRepo();
  return useQuery({
    queryKey: policyTreeQueryKeys.treeByPolicy(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => repo.getTreeByPolicy(policyId),
  });
}

export function usePolicyTreeWithConditions(policyId: string) {
  const repo = usePolicyTreeRepo();
  return useQuery({
    queryKey: policyTreeQueryKeys.treeWithConditions(policyId),
    enabled: Boolean(policyId),
    queryFn: async () => {
      const { data, error } = await repo.getTreeWithConditions(policyId);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useConditionsByNode(nodeId: string) {
  const repo = usePolicyTreeRepo();
  return useQuery({
    queryKey: policyTreeQueryKeys.conditionsByNode(nodeId),
    enabled: Boolean(nodeId),
    queryFn: async () => repo.getConditionsByNode(nodeId),
  });
}

export function useCreateTreeNode(policyId: string) {
  const qc = useQueryClient();
  const repo = usePolicyTreeRepo();
  return useMutation({
    mutationFn: async (input: PolicyTreeNodeInput) => {
      const payload = { ...input, metadata: (input.metadata ?? null) as Json | null };
      const { data, error } = await repo.createNode(payload);
      if (error) throw error;
      return data as PolicyTreeNode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeByPolicy(policyId) });
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeWithConditions(policyId) });
    },
  });
}

export function useUpdateTreeNode(policyId: string) {
  const qc = useQueryClient();
  const repo = usePolicyTreeRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PolicyTreeNodeInput> }) => {
      const payload = { ...input, metadata: (input.metadata ?? null) as Json | null };
      const { data, error } = await repo.updateNode(id, payload);
      if (error) throw error;
      return data as PolicyTreeNode;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeByPolicy(policyId) });
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeWithConditions(policyId) });
    },
  });
}

export function useDeleteTreeNode(policyId: string) {
  const qc = useQueryClient();
  const repo = usePolicyTreeRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.deleteNode(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeByPolicy(policyId) });
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeWithConditions(policyId) });
    },
  });
}

export function useCreateTreeCondition(policyId: string) {
  const qc = useQueryClient();
  const repo = usePolicyTreeRepo();
  return useMutation({
    mutationFn: async (input: PolicyTreeConditionInput) => {
      const payload = { ...input, rules: (input.rules ?? null) as Json | null };
      const { data, error } = await repo.createCondition(payload);
      if (error) throw error;
      return data as PolicyTreeCondition;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeWithConditions(policyId) });
    },
  });
}

export function useUpdateTreeCondition(policyId: string) {
  const qc = useQueryClient();
  const repo = usePolicyTreeRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PolicyTreeConditionInput> }) => {
      const payload = { ...input, rules: (input.rules ?? null) as Json | null };
      const { data, error } = await repo.updateCondition(id, payload);
      if (error) throw error;
      return data as PolicyTreeCondition;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeWithConditions(policyId) });
    },
  });
}

export function useDeleteTreeCondition(policyId: string) {
  const qc = useQueryClient();
  const repo = usePolicyTreeRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.deleteCondition(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: policyTreeQueryKeys.treeWithConditions(policyId) });
    },
  });
}
