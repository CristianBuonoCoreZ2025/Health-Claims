"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArancelesRepository, arancelesQueryKeys } from "@/repositories/aranceles.repository";
import type { ArancelInput } from "@/schemas/arancel.schema";
import type { Arancel } from "@/types";

// Hook cliente para obtener el repositorio de aranceles con el browser client.
function useArancelesRepo() {
  const client = createSupabaseBrowserClient();
  return new ArancelesRepository(client);
}

// Obtiene el arbol completo de aranceles ordenado por nivel y codigo.
export function useArancelesTree() {
  const repo = useArancelesRepo();
  return useQuery({
    queryKey: arancelesQueryKeys.tree(),
    queryFn: async () => repo.getTree(),
  });
}

// Obtiene las raices del arbol de aranceles (parent_id es null).
export function useArancelRoots() {
  const repo = useArancelesRepo();
  return useQuery({
    queryKey: arancelesQueryKeys.roots(),
    queryFn: async () => repo.getRoots(),
  });
}

// Obtiene los hijos de un arancel dado su parentId.
export function useArancelChildren(parentId: string | null) {
  const repo = useArancelesRepo();
  return useQuery({
    queryKey: arancelesQueryKeys.children(parentId ?? ""),
    enabled: Boolean(parentId),
    queryFn: async () => repo.getChildren(parentId as string),
  });
}

// Obtiene los aranceles de un nivel especifico.
export function useArancelesByLevel(level: number) {
  const repo = useArancelesRepo();
  return useQuery({
    queryKey: arancelesQueryKeys.byLevel(level),
    queryFn: async () => repo.getByLevel(level),
  });
}

// Crea un arancel.
export function useCreateArancel() {
  const qc = useQueryClient();
  const repo = useArancelesRepo();
  return useMutation({
    mutationFn: async (input: ArancelInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Arancel;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: arancelesQueryKeys.all() });
    },
  });
}

// Actualiza un arancel.
export function useUpdateArancel() {
  const qc = useQueryClient();
  const repo = useArancelesRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ArancelInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Arancel;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: arancelesQueryKeys.all() });
    },
  });
}

// Desactiva un arancel (soft delete).
export function useDeleteArancel() {
  const qc = useQueryClient();
  const repo = useArancelesRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: arancelesQueryKeys.all() });
    },
  });
}
