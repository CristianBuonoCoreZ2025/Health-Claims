"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DocumentTypesRepository, documentTypesQueryKeys } from "@/repositories/document-types.repository";
import type { DocumentTypeInput } from "@/schemas/document-type.schema";
import type { DocumentType } from "@/types";

export function useDocumentTypes() {
  const client = createSupabaseBrowserClient();
  const repo = new DocumentTypesRepository(client);
  return useQuery({
    queryKey: documentTypesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchDocumentTypesByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new DocumentTypesRepository(client);
  return useQuery({
    queryKey: documentTypesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateDocumentType() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new DocumentTypesRepository(client);
  return useMutation({
    mutationFn: async (input: DocumentTypeInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as DocumentType;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentTypesQueryKeys.all() });
    },
  });
}

export function useUpdateDocumentType() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new DocumentTypesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<DocumentTypeInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as DocumentType;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentTypesQueryKeys.all() });
    },
  });
}

export function useDeleteDocumentType() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new DocumentTypesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: documentTypesQueryKeys.all() });
    },
  });
}
