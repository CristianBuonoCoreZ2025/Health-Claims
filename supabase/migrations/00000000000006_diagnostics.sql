-- Tabla diagnostics (catalogo CIE-10) con busqueda full-text + trigram.

create table if not exists public.diagnostics (
  id          uuid primary key default gen_random_uuid(),
  code_cie10  text not null unique,
  name        text not null,
  description text,
  keywords    tsvector,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint diagnostics_code_chk check (length(trim(code_cie10)) > 0),
  constraint diagnostics_name_chk check (length(trim(name)) > 0)
);

create index if not exists diagnostics_code_cie10_idx on public.diagnostics (code_cie10);
create index if not exists diagnostics_name_trgm_idx  on public.diagnostics using gin (name gin_trgm_ops);
create index if not exists diagnostics_code_trgm_idx  on public.diagnostics using gin (code_cie10 gin_trgm_ops);
create index if not exists diagnostics_keywords_idx   on public.diagnostics using gin (keywords);
create index if not exists diagnostics_is_active_idx  on public.diagnostics (is_active);

-- Mantener keywords sincronizado con nombre + descripcion + codigo.
create or replace function public.diagnostics_keywords_tsv()
returns trigger
language plpgsql
as $$
begin
  new.keywords := to_tsvector('simple',
    coalesce(new.code_cie10, '') || ' ' ||
    coalesce(new.name, '') || ' ' ||
    coalesce(new.description, '')
  );
  return new;
end;
$$;

drop trigger if exists trg_diagnostics_keywords on public.diagnostics;
create trigger trg_diagnostics_keywords
  before insert or update on public.diagnostics
  for each row execute function public.diagnostics_keywords_tsv();

drop trigger if exists trg_diagnostics_updated_at on public.diagnostics;
create trigger trg_diagnostics_updated_at
  before update on public.diagnostics
  for each row execute function public.set_updated_at();

drop trigger if exists trg_diagnostics_audit_user on public.diagnostics;
create trigger trg_diagnostics_audit_user
  before insert or update on public.diagnostics
  for each row execute function public.set_audit_user();

alter table public.diagnostics enable row level security;

drop policy if exists "diagnostics_select_authenticated" on public.diagnostics;
create policy "diagnostics_select_authenticated"
  on public.diagnostics for select
  using (public.current_user_id() is not null);

drop policy if exists "diagnostics_insert_admin" on public.diagnostics;
create policy "diagnostics_insert_admin"
  on public.diagnostics for insert
  with check (public.has_role('admin'));

drop policy if exists "diagnostics_update_admin" on public.diagnostics;
create policy "diagnostics_update_admin"
  on public.diagnostics for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "diagnostics_delete_admin" on public.diagnostics;
create policy "diagnostics_delete_admin"
  on public.diagnostics for delete
  using (public.has_role('admin'));
