"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  OperacionesRepository,
  operacionesQueryKeys,
} from "@/repositories/operaciones.repository";
import { claimsQueryKeys } from "@/repositories/claims.repository";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new OperacionesRepository(client);
}

export function useLiquidatorWorkload() {
  const repo = useRepo();
  return useQuery({
    queryKey: operacionesQueryKeys.workload(),
    queryFn: async () => repo.getWorkload(),
  });
}

export function useClaimRejections() {
  const repo = useRepo();
  return useQuery({
    queryKey: operacionesQueryKeys.rejections(),
    queryFn: async () => repo.getRejections(),
  });
}

export function useReingresarSiniestro() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ claimId, description }: { claimId: string; description?: string }) => {
      const { error } = await repo.reingresarSiniestro(claimId, description);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: operacionesQueryKeys.all() });
      void qc.invalidateQueries({ queryKey: claimsQueryKeys.all() });
      toast.success("Siniestro reingresado y reasignado");
    },
  });
}

export function useAnularSiniestro() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ claimId, description }: { claimId: string; description?: string }) => {
      const { error } = await repo.anularSiniestro(claimId, description);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: operacionesQueryKeys.all() });
      void qc.invalidateQueries({ queryKey: claimsQueryKeys.all() });
      toast.success("Siniestro anulado");
    },
  });
}
