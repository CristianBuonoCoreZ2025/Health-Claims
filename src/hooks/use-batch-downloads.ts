"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  BatchDownloadsRepository,
  batchDownloadsQueryKeys,
} from "@/repositories/batch-downloads.repository";
import type { BatchDownloadInput } from "@/schemas/batch-download.schema";
import type { BatchDownload } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new BatchDownloadsRepository(client);
}

export function useBatchDownloads() {
  const repo = useRepo();
  return useQuery({
    queryKey: batchDownloadsQueryKeys.all(),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateBatchDownload() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: BatchDownloadInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as BatchDownload;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: batchDownloadsQueryKeys.all() });
    },
  });
}

export function useUpdateBatchDownload() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<BatchDownloadInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as BatchDownload;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: batchDownloadsQueryKeys.all() });
    },
  });
}

export function useDeleteBatchDownload() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: batchDownloadsQueryKeys.all() });
    },
  });
}
