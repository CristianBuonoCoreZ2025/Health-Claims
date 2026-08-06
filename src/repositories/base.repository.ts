import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";

// Factory de query keys para TanStack Query. Centraliza la convencion de keys
// por tabla/entidad para invalidacion consistente.
export const queryKeys = {
  all: ["health-claims"] as const,
  table: (table: keyof Database["public"]["Tables"]) =>
    [...queryKeys.all, "table", table] as const,
  tableList: (
    table: keyof Database["public"]["Tables"],
    filters?: Record<string, unknown>
  ) => [...queryKeys.table(table), "list", filters] as const,
  tableDetail: (
    table: keyof Database["public"]["Tables"],
    id: string
  ) => [...queryKeys.table(table), "detail", id] as const,
};

type TableName = keyof Database["public"]["Tables"];
type RowType<T extends TableName> = Database["public"]["Tables"][T]["Row"];
type InsertType<T extends TableName> = Database["public"]["Tables"][T]["Insert"];
type UpdateType<T extends TableName> = Database["public"]["Tables"][T]["Update"];

type RepoResult<T> = { data: T | null; error: PostgrestError | null };

// Builder minimal interno: los tipos generados de Supabase no componen bien
// con un generico distributivo sobre el nombre de tabla, por lo que aqui se
// relaja el tipado de columnas (string) manteniendo el tipado de filas en los
// resultados. No se usa `any`; los valores de filtro son `unknown`.
interface RelaxedBuilder<T> {
  select(columns?: string): RelaxedBuilder<T>;
  insert(payload: unknown): RelaxedBuilder<T>;
  update(payload: unknown): RelaxedBuilder<T>;
  delete(): RelaxedBuilder<T>;
  eq(column: string, value: unknown): RelaxedBuilder<T>;
  order(column: string, opts?: { ascending?: boolean }): RelaxedBuilder<T>;
  maybeSingle(): PromiseLike<{ data: T | null; error: PostgrestError | null }>;
  then<TResult1 = { data: T[] | null; error: PostgrestError | null }, TResult2 = never>(
    onfulfilled?: (
      v: { data: T[] | null; error: PostgrestError | null }
    ) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (e: unknown) => TResult2 | PromiseLike<TResult2>
  ): PromiseLike<TResult1 | TResult2>;
}

// Repositorio generico CRUD tipado sobre una tabla de Supabase.
// Las instancias se crean inyectando un cliente Supabase (server o browser).
// Nota: tras `npm run db:gen` los tipos generados quedan exactos; este builder
// relajado mantiene compilacion estable mientras tanto.
export class BaseRepository<T extends TableName> {
  constructor(
    protected readonly table: T,
    protected readonly client: SupabaseClient<Database>
  ) {}

  protected from(): RelaxedBuilder<RowType<T>> {
    return this.client.from(this.table) as unknown as RelaxedBuilder<RowType<T>>;
  }

  async findAll(): Promise<RepoResult<RowType<T>[]>> {
    const result = await this.from().select("*");
    return { data: result.data ?? null, error: result.error };
  }

  async findById(id: string): Promise<RepoResult<RowType<T>>> {
    const result = await this.from().select("*").eq("id", id).maybeSingle();
    return { data: result.data ?? null, error: result.error };
  }

  async insert(payload: InsertType<T>): Promise<RepoResult<RowType<T>>> {
    const result = await this.from().insert(payload).select("*").maybeSingle();
    return { data: result.data ?? null, error: result.error };
  }

  async update(id: string, payload: UpdateType<T>): Promise<RepoResult<RowType<T>>> {
    const result = await this
      .from()
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    return { data: result.data ?? null, error: result.error };
  }

  async softDelete(id: string): Promise<RepoResult<RowType<T>>> {
    const result = await this
      .from()
      .update({ is_active: false })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    return { data: result.data ?? null, error: result.error };
  }

  async remove(id: string): Promise<{ error: PostgrestError | null }> {
    const result = await this.from().delete().eq("id", id);
    return { error: result.error };
  }
}
