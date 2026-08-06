-- Tabla medications (catalogo de medicamentos).

create table if not exists public.medications (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  active_ingredient text,
  dosage           text,
  presentation    text,
  laboratory      text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid,
  updated_by       uuid,
  constraint medications_name_chk check (length(trim(name)) > 0)
);

create index if not exists medications_name_idx             on public.medications (name);
create index if not exists medications_active_ingredient_idx on public.medications (active_ingredient);
create index if not exists medications_name_trgm_idx        on public.medications using gin (name gin_trgm_ops);
create index if not exists medications_is_active_idx        on public.medications (is_active);

drop trigger if exists trg_medications_updated_at on public.medications;
create trigger trg_medications_updated_at
  before update on public.medications
  for each row execute function public.set_updated_at();

drop trigger if exists trg_medications_audit_user on public.medications;
create trigger trg_medications_audit_user
  before insert or update on public.medications
  for each row execute function public.set_audit_user();

alter table public.medications enable row level security;

drop policy if exists "medications_select_authenticated" on public.medications;
create policy "medications_select_authenticated"
  on public.medications for select
  using (public.current_user_id() is not null);

drop policy if exists "medications_insert_admin" on public.medications;
create policy "medications_insert_admin"
  on public.medications for insert
  with check (public.has_role('admin'));

drop policy if exists "medications_update_admin" on public.medications;
create policy "medications_update_admin"
  on public.medications for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "medications_delete_admin" on public.medications;
create policy "medications_delete_admin"
  on public.medications for delete
  using (public.has_role('admin'));
