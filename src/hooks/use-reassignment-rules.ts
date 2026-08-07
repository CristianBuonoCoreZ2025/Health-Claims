"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ReassignmentRulesRepository,
  reassignmentRulesQueryKeys,
} from "@/repositories/reassignment-rules.repository";
import type { ReassignmentRuleInput } from "@/schemas/reassignment-rule.schema";
import type { ReassignmentRule } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new ReassignmentRulesRepository(client);
}

export function useReassignmentRules() {
  const repo = useRepo();
  return useQuery({
    queryKey: reassignmentRulesQueryKeys.all(),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateReassignmentRule() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: ReassignmentRuleInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ReassignmentRule;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reassignmentRulesQueryKeys.all() });
    },
  });
}

export function useUpdateReassignmentRule() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ReassignmentRuleInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ReassignmentRule;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reassignmentRulesQueryKeys.all() });
    },
  });
}

export function useDeleteReassignmentRule() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reassignmentRulesQueryKeys.all() });
    },
  });
}
