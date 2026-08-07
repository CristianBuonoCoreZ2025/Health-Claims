"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ClaimReceiptsRepository, claimReceiptsQueryKeys } from "@/repositories/claim-receipts.repository";
import type { ClaimReceiptInput } from "@/schemas/claim-receipt.schema";
import type { ClaimReceipt } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new ClaimReceiptsRepository(client);
}

export function useClaimReceipts(claimId: string) {
  const repo = useRepo();
  return useQuery({
    queryKey: claimReceiptsQueryKeys.byClaim(claimId),
    enabled: Boolean(claimId),
    queryFn: async () => repo.getByClaim(claimId),
  });
}

export function useCreateClaimReceipt() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: ClaimReceiptInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ClaimReceipt;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimReceiptsQueryKeys.all() });
    },
  });
}

export function useUpdateClaimReceipt() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ClaimReceiptInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ClaimReceipt;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimReceiptsQueryKeys.all() });
    },
  });
}

export function useDeleteClaimReceipt() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimReceiptsQueryKeys.all() });
    },
  });
}
