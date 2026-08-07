"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ClaimFormsRepository, claimFormsQueryKeys } from "@/repositories/claim-forms.repository";
import type { ClaimFormInput } from "@/schemas/claim-form.schema";
import type { ClaimForm } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new ClaimFormsRepository(client);
}

export function useClaimForms(claimId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: claimFormsQueryKeys.byClaim(claimId),
    enabled: Boolean(claimId),
    queryFn: async () => repo.getByClaim(claimId),
  });
}

export function useCreateClaimForm() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: ClaimFormInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ClaimForm;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimFormsQueryKeys.all() });
    },
  });
}

export function useUpdateClaimForm() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ClaimFormInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ClaimForm;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimFormsQueryKeys.all() });
    },
  });
}

export function useDeleteClaimForm() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimFormsQueryKeys.all() });
    },
  });
}
