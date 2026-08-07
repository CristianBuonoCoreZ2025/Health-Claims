"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ClaimPaymentsRepository, claimPaymentsQueryKeys } from "@/repositories/claim-payments.repository";
import type { ClaimPaymentInput } from "@/schemas/claim-payment.schema";
import type { ClaimPayment } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new ClaimPaymentsRepository(client);
}

export function useClaimPayments(claimId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: claimPaymentsQueryKeys.byClaim(claimId),
    enabled: Boolean(claimId),
    queryFn: async () => repo.getByClaim(claimId),
  });
}

export function useCreateClaimPayment() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: ClaimPaymentInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ClaimPayment;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimPaymentsQueryKeys.all() });
    },
  });
}

export function useUpdateClaimPayment() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ClaimPaymentInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ClaimPayment;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimPaymentsQueryKeys.all() });
    },
  });
}

export function useDeleteClaimPayment() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimPaymentsQueryKeys.all() });
    },
  });
}
