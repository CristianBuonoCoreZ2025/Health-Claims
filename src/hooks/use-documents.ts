"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  DocumentsRepository,
  documentsQueryKeys,
} from "@/repositories/documents.repository";
import type { DocumentInput } from "@/schemas/document.schema";
import type { Document } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new DocumentsRepository(client);
}

export function useDocuments() {
  const repo = useRepo();
  return useQuery({
    queryKey: documentsQueryKeys.all(),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: DocumentInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentsQueryKeys.all() });
    },
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<DocumentInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentsQueryKeys.all() });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentsQueryKeys.all() });
    },
  });
}
