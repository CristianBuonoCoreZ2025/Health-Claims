"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  DiagnosticsRepository,
  diagnosticsQueryKeys,
} from "@/repositories/diagnostics.repository";
import type { DiagnosticInput } from "@/schemas/diagnostic.schema";
import type { Diagnostic } from "@/types";

// Hook cliente para obtener el repositorio de diagnostics con el browser client.
function useDiagnosticsRepo() {
  const client = createSupabaseBrowserClient();
  return new DiagnosticsRepository(client);
}

// Lista todos los diagnosticos activos.
export function useDiagnostics() {
  const repo = useDiagnosticsRepo();
  return useQuery({
    queryKey: diagnosticsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

// Busca diagnosticos por codigo CIE-10.
export function useSearchDiagnosticsByCode(code: string) {
  const repo = useDiagnosticsRepo();
  return useQuery({
    queryKey: diagnosticsQueryKeys.searchByCode(code),
    enabled: code.length > 0,
    queryFn: async () => repo.searchByCode(code),
  });
}

// Busca diagnosticos por nombre.
export function useSearchDiagnosticsByName(name: string) {
  const repo = useDiagnosticsRepo();
  return useQuery({
    queryKey: diagnosticsQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

// Crea un diagnostico.
export function useCreateDiagnostic() {
  const qc = useQueryClient();
  const repo = useDiagnosticsRepo();
  return useMutation({
    mutationFn: async (input: DiagnosticInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Diagnostic;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: diagnosticsQueryKeys.all() });
    },
  });
}

// Actualiza un diagnostico.
export function useUpdateDiagnostic() {
  const qc = useQueryClient();
  const repo = useDiagnosticsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<DiagnosticInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Diagnostic;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: diagnosticsQueryKeys.all() });
    },
  });
}

// Desactiva un diagnostico (soft delete).
export function useDeleteDiagnostic() {
  const qc = useQueryClient();
  const repo = useDiagnosticsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: diagnosticsQueryKeys.all() });
    },
  });
}
