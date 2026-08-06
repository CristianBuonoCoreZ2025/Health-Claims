"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ParentRelationshipsRepository, parentRelationshipsQueryKeys } from "@/repositories/parent-relationships.repository";
import type { ParentRelationshipInput } from "@/schemas/parent-relationship.schema";
import type { ParentRelationship } from "@/types";

export function useParentRelationships() {
  const client = createSupabaseBrowserClient();
  const repo = new ParentRelationshipsRepository(client);
  return useQuery({
    queryKey: parentRelationshipsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchParentRelationshipsByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new ParentRelationshipsRepository(client);
  return useQuery({
    queryKey: parentRelationshipsQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateParentRelationship() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new ParentRelationshipsRepository(client);
  return useMutation({
    mutationFn: async (input: ParentRelationshipInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ParentRelationship;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: parentRelationshipsQueryKeys.all() });
    },
  });
}

export function useUpdateParentRelationship() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new ParentRelationshipsRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ParentRelationshipInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ParentRelationship;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: parentRelationshipsQueryKeys.all() });
    },
  });
}

export function useDeleteParentRelationship() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new ParentRelationshipsRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: parentRelationshipsQueryKeys.all() });
    },
  });
}
