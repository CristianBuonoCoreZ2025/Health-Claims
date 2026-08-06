-- Tabla provider_coverages (junction many-to-many providers <-> coverage_types).
-- Permite asociar tipos de cobertura a cada prestador.

create table if not exists public.provider_coverages (
  id               uuid primary key default gen_random_uuid(),
  provider_id      uuid not null references public.providers(id) on delete cascade,
  coverage_type_id uuid not null references public.coverage_types(id) on delete cascade,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid,
  updated_by       uuid,
  constraint provider_coverages_uniq unique (provider_id, coverage_type_id)
);

create index if not exists provider_coverages_provider_idx      on public.provider_coverages (provider_id);
create index if not exists provider_coverages_coverage_type_idx on public.provider_coverages (coverage_type_id);

drop trigger if exists trg_provider_coverages_updated_at on public.provider_coverages;
create trigger trg_provider_coverages_updated_at
  before update on public.provider_coverages
  for each row execute function public.set_updated_at();

drop trigger if exists trg_provider_coverages_audit_user on public.provider_coverages;
create trigger trg_provider_coverages_audit_user
  before insert or update on public.provider_coverages
  for each row execute function public.set_audit_user();

alter table public.provider_coverages enable row level security;

drop policy if exists "provider_coverages_select_authenticated" on public.provider_coverages;
create policy "provider_coverages_select_authenticated"
  on public.provider_coverages for select
  using (public.current_user_id() is not null);

drop policy if exists "provider_coverages_insert_staff" on public.provider_coverages;
create policy "provider_coverages_insert_staff"
  on public.provider_coverages for insert
  with check (public.has_role('admin') or public.has_role('supervisor'));

drop policy if exists "provider_coverages_update_staff" on public.provider_coverages;
create policy "provider_coverages_update_staff"
  on public.provider_coverages for update
  using (public.has_role('admin') or public.has_role('supervisor'))
  with check (public.has_role('admin') or public.has_role('supervisor'));

drop policy if exists "provider_coverages_delete_staff" on public.provider_coverages;
create policy "provider_coverages_delete_staff"
  on public.provider_coverages for delete
  using (public.has_role('admin') or public.has_role('supervisor'));
