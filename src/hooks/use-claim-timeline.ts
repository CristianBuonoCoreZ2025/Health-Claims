"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ClaimTimelineRepository,
  claimTimelineQueryKeys,
} from "@/repositories/claim-timeline.repository";
import type { ClaimTimelineInput } from "@/schemas/claim-timeline.schema";
import type { ClaimTimeline } from "@/types";

// Hook cliente para obtener el repositorio de claim timeline con el browser client.
function useClaimTimelineRepo() {
  const client = createSupabaseBrowserClient();
  return new ClaimTimelineRepository(client);
}

// Lista las entradas de timeline de un claim.
export function useClaimTimeline(claimId: string) {
  const repo = useClaimTimelineRepo();
  return useQuery({
    queryKey: claimTimelineQueryKeys.byClaim(claimId),
    enabled: Boolean(claimId),
    queryFn: async () => repo.getByClaim(claimId),
  });
}

// Crea una entrada de timeline.
export function useCreateTimelineEntry() {
  const qc = useQueryClient();
  const repo = useClaimTimelineRepo();
  return useMutation({
    mutationFn: async (input: ClaimTimelineInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ClaimTimeline;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: claimTimelineQueryKeys.all() });
    },
  });
}
