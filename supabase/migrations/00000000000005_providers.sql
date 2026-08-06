-- Tabla providers (prestadores de salud: clinicas, medicos, laboratorios).

create table if not exists public.providers (
  id            uuid primary key default gen_random_uuid(),
  rut           text not null,
  name          text not null,
  business_name text,
  specialty     text,
  email         text,
  phone         text,
  bank_account  text,
  bank_id       text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint providers_name_chk check (length(trim(name)) > 0),
  constraint providers_rut_chk  check (length(trim(rut)) > 0),
  constraint providers_email_chk check (email is null or email ~* '^[^@]+@[^@]+\.[^@]+$')
);

create index if not exists providers_name_idx      on public.providers (name);
create index if not exists providers_rut_idx       on public.providers (rut);
create index if not exists providers_specialty_idx on public.providers (specialty);
create index if not exists providers_is_active_idx on public.providers (is_active);

drop trigger if exists trg_providers_updated_at on public.providers;
create trigger trg_providers_updated_at
  before update on public.providers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_providers_audit_user on public.providers;
create trigger trg_providers_audit_user
  before insert or update on public.providers
  for each row execute function public.set_audit_user();

alter table public.providers enable row level security;

drop policy if exists "providers_select_authenticated" on public.providers;
create policy "providers_select_authenticated"
  on public.providers for select
  using (public.current_user_id() is not null);

drop policy if exists "providers_insert_admin" on public.providers;
create policy "providers_insert_admin"
  on public.providers for insert
  with check (public.has_role('admin') or public.has_role('supervisor'));

drop policy if exists "providers_update_admin" on public.providers;
create policy "providers_update_admin"
  on public.providers for update
  using (public.has_role('admin') or public.has_role('supervisor'))
  with check (public.has_role('admin') or public.has_role('supervisor'));

drop policy if exists "providers_delete_admin" on public.providers;
create policy "providers_delete_admin"
  on public.providers for delete
  using (public.has_role('admin'));
