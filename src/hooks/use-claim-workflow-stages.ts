"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ClaimWorkflowStagesRepository, claimWorkflowStagesQueryKeys } from "@/repositories/claim-workflow-stages.repository";
import type { ClaimWorkflowStageInput } from "@/schemas/claim-workflow-stage.schema";
import type { ClaimWorkflowStage } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new ClaimWorkflowStagesRepository(client);
}

export function useClaimWorkflowStages(claimId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: claimWorkflowStagesQueryKeys.byClaim(claimId),
    enabled: Boolean(claimId),
    queryFn: async () => repo.getByClaim(claimId),
  });
}

export function useCreateClaimWorkflowStage() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: ClaimWorkflowStageInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ClaimWorkflowStage;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimWorkflowStagesQueryKeys.all() });
    },
  });
}

export function useUpdateClaimWorkflowStage() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ClaimWorkflowStageInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ClaimWorkflowStage;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimWorkflowStagesQueryKeys.all() });
    },
  });
}

export function useDeleteClaimWorkflowStage() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimWorkflowStagesQueryKeys.all() });
    },
  });
}
