-- Tabla coverage_types (tipos de cobertura: hospitalaria, ambulatoria, dental, etc.).

create table if not exists public.coverage_types (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint coverage_types_name_chk check (length(trim(name)) > 0)
);

create index if not exists coverage_types_name_idx      on public.coverage_types (name);
create index if not exists coverage_types_is_active_idx on public.coverage_types (is_active);

drop trigger if exists trg_coverage_types_updated_at on public.coverage_types;
create trigger trg_coverage_types_updated_at
  before update on public.coverage_types
  for each row execute function public.set_updated_at();

drop trigger if exists trg_coverage_types_audit_user on public.coverage_types;
create trigger trg_coverage_types_audit_user
  before insert or update on public.coverage_types
  for each row execute function public.set_audit_user();

alter table public.coverage_types enable row level security;

drop policy if exists "coverage_types_select_authenticated" on public.coverage_types;
create policy "coverage_types_select_authenticated"
  on public.coverage_types for select
  using (public.current_user_id() is not null);

drop policy if exists "coverage_types_insert_admin" on public.coverage_types;
create policy "coverage_types_insert_admin"
  on public.coverage_types for insert
  with check (public.has_role('admin'));

drop policy if exists "coverage_types_update_admin" on public.coverage_types;
create policy "coverage_types_update_admin"
  on public.coverage_types for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "coverage_types_delete_admin" on public.coverage_types;
create policy "coverage_types_delete_admin"
  on public.coverage_types for delete
  using (public.has_role('admin'));
