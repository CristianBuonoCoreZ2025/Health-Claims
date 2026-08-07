"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  DocumentTemplatesRepository,
  documentTemplatesQueryKeys,
} from "@/repositories/document-templates.repository";
import type { DocumentTemplateInput } from "@/schemas/document-template.schema";
import type { DocumentTemplate, DocumentTemplateInsert, DocumentTemplateUpdate } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new DocumentTemplatesRepository(client);
}

export function useDocumentTemplates() {
  const repo = useRepo();
  return useQuery({
    queryKey: documentTemplatesQueryKeys.all(),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateDocumentTemplate() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: DocumentTemplateInput) => {
      const { data, error } = await repo.insert(input as unknown as DocumentTemplateInsert);
      if (error) throw error;
      return data as DocumentTemplate;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentTemplatesQueryKeys.all() });
    },
  });
}

export function useUpdateDocumentTemplate() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<DocumentTemplateInput> }) => {
      const { data, error } = await repo.update(id, input as unknown as DocumentTemplateUpdate);
      if (error) throw error;
      return data as DocumentTemplate;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentTemplatesQueryKeys.all() });
    },
  });
}

export function useDeleteDocumentTemplate() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentTemplatesQueryKeys.all() });
    },
  });
}
