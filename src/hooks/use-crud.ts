"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";
import { BaseRepository, queryKeys } from "@/repositories/base.repository";

type TableName = keyof Database["public"]["Tables"];
type RowType<T extends TableName> = Database["public"]["Tables"][T]["Row"];
type InsertType<T extends TableName> = Database["public"]["Tables"][T]["Insert"];
type UpdateType<T extends TableName> = Database["public"]["Tables"][T]["Update"];

// Hook generico de listado para una tabla. Usa el repositorio base para
// `findAll`. El cliente browser se crea una vez por llamada.
export function useList<T extends TableName>(
  table: T,
  client: SupabaseClient<Database>,
  enabled = true
) {
  const repo = new BaseRepository<T>(table, client);
  return useQuery({
    queryKey: queryKeys.tableList(table),
    enabled,
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Hook generico de detalle por id.
export function useDetail<T extends TableName>(
  table: T,
  id: string,
  client: SupabaseClient<Database>,
  enabled = true
) {
  const repo = new BaseRepository<T>(table, client);
  return useQuery({
    queryKey: queryKeys.tableDetail(table, id),
    enabled: enabled && Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.findById(id);
      if (error) throw error;
      return data;
    },
  });
}

// Hook generico de creacion. Invalida la lista de la tabla al mutar.
export function useCreate<T extends TableName>(
  table: T,
  client: SupabaseClient<Database>
) {
  const qc = useQueryClient();
  const repo = new BaseRepository<T>(table, client);
  return useMutation({
    mutationFn: async (payload: InsertType<T>) => {
      const { data, error } = await repo.insert(payload);
      if (error) throw error;
      return data as RowType<T>;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.table(table) });
    },
  });
}

// Hook generico de actualizacion por id.
export function useUpdate<T extends TableName>(
  table: T,
  client: SupabaseClient<Database>
) {
  const qc = useQueryClient();
  const repo = new BaseRepository<T>(table, client);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateType<T> }) => {
      const { data, error } = await repo.update(id, payload);
      if (error) throw error;
      return data as RowType<T>;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.table(table) });
    },
  });
}

// Hook generico de soft delete (marca is_active = false).
export function useSoftDelete<T extends TableName>(
  table: T,
  client: SupabaseClient<Database>
) {
  const qc = useQueryClient();
  const repo = new BaseRepository<T>(table, client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await repo.softDelete(id);
      if (error) throw error;
      return data as RowType<T>;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.table(table) });
    },
  });
}
