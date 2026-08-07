-- Fase 4.1: Jerarquia de servicios N2/N5 y rectificacion de policies.

-- =====================================
-- 1. Rectificacion de policies
-- =====================================
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'effective_date'
  ) then
    alter table public.policies add column effective_date date;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'renewal_date'
  ) then
    alter table public.policies add column renewal_date date;
  end if;
end $$;

-- =====================================
-- 2. Grupos de prestacion N2
-- =====================================
create table if not exists public.service_groups (
  id          uuid primary key default gen_random_uuid(),
  code        text not null,
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint service_groups_code_chk check (length(trim(code)) > 0),
  constraint service_groups_name_chk check (length(trim(name)) > 0)
);

create index if not exists service_groups_code_idx on public.service_groups (code);
create index if not exists service_groups_name_idx on public.service_groups (name);
create index if not exists service_groups_is_active_idx on public.service_groups (is_active);

drop trigger if exists trg_service_groups_updated_at on public.service_groups;
create trigger trg_service_groups_updated_at
  before update on public.service_groups
  for each row execute function public.set_updated_at();

drop trigger if exists trg_service_groups_audit_user on public.service_groups;
create trigger trg_service_groups_audit_user
  before insert or update on public.service_groups
  for each row execute function public.set_audit_user();

alter table public.service_groups enable row level security;

drop policy if exists "service_groups_select_authenticated" on public.service_groups;
create policy "service_groups_select_authenticated"
  on public.service_groups for select
  using (public.current_user_id() is not null);

drop policy if exists "service_groups_insert_admin" on public.service_groups;
create policy "service_groups_insert_admin"
  on public.service_groups for insert
  with check (public.has_role('admin'));

drop policy if exists "service_groups_update_admin" on public.service_groups;
create policy "service_groups_update_admin"
  on public.service_groups for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "service_groups_delete_admin" on public.service_groups;
create policy "service_groups_delete_admin"
  on public.service_groups for delete
  using (public.has_role('admin'));

-- =====================================
-- 3. Subgrupos de prestacion N3
-- =====================================
create table if not exists public.service_subgroups (
  id               uuid primary key default gen_random_uuid(),
  service_group_id uuid not null references public.service_groups(id) on delete restrict,
  code             text not null,
  name             text not null,
  description      text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid,
  updated_by       uuid,
  constraint service_subgroups_code_chk check (length(trim(code)) > 0),
  constraint service_subgroups_name_chk check (length(trim(name)) > 0)
);

create index if not exists service_subgroups_group_idx on public.service_subgroups (service_group_id);
create index if not exists service_subgroups_code_idx on public.service_subgroups (code);
create index if not exists service_subgroups_is_active_idx on public.service_subgroups (is_active);

drop trigger if exists trg_service_subgroups_updated_at on public.service_subgroups;
create trigger trg_service_subgroups_updated_at
  before update on public.service_subgroups
  for each row execute function public.set_updated_at();

drop trigger if exists trg_service_subgroups_audit_user on public.service_subgroups;
create trigger trg_service_subgroups_audit_user
  before insert or update on public.service_subgroups
  for each row execute function public.set_audit_user();

alter table public.service_subgroups enable row level security;

drop policy if exists "service_subgroups_select_authenticated" on public.service_subgroups;
create policy "service_subgroups_select_authenticated"
  on public.service_subgroups for select
  using (public.current_user_id() is not null);

drop policy if exists "service_subgroups_insert_admin" on public.service_subgroups;
create policy "service_subgroups_insert_admin"
  on public.service_subgroups for insert
  with check (public.has_role('admin'));

drop policy if exists "service_subgroups_update_admin" on public.service_subgroups;
create policy "service_subgroups_update_admin"
  on public.service_subgroups for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "service_subgroups_delete_admin" on public.service_subgroups;
create policy "service_subgroups_delete_admin"
  on public.service_subgroups for delete
  using (public.has_role('admin'));

-- =====================================
-- 4. Prestaciones N5
-- =====================================
create table if not exists public.service_items (
  id                 uuid primary key default gen_random_uuid(),
  code               text not null,
  name               text not null,
  description        text,
  service_subgroup_id uuid not null references public.service_subgroups(id) on delete restrict,
  specialty_id       uuid references public.specialties(id) on delete set null,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid,
  updated_by         uuid,
  constraint service_items_code_chk check (length(trim(code)) > 0),
  constraint service_items_name_chk check (length(trim(name)) > 0)
);

create index if not exists service_items_subgroup_idx on public.service_items (service_subgroup_id);
create index if not exists service_items_specialty_idx on public.service_items (specialty_id);
create index if not exists service_items_code_idx on public.service_items (code);
create index if not exists service_items_is_active_idx on public.service_items (is_active);

drop trigger if exists trg_service_items_updated_at on public.service_items;
create trigger trg_service_items_updated_at
  before update on public.service_items
  for each row execute function public.set_updated_at();

drop trigger if exists trg_service_items_audit_user on public.service_items;
create trigger trg_service_items_audit_user
  before insert or update on public.service_items
  for each row execute function public.set_audit_user();

alter table public.service_items enable row level security;

drop policy if exists "service_items_select_authenticated" on public.service_items;
create policy "service_items_select_authenticated"
  on public.service_items for select
  using (public.current_user_id() is not null);

drop policy if exists "service_items_insert_admin" on public.service_items;
create policy "service_items_insert_admin"
  on public.service_items for insert
  with check (public.has_role('admin'));

drop policy if exists "service_items_update_admin" on public.service_items;
create policy "service_items_update_admin"
  on public.service_items for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "service_items_delete_admin" on public.service_items;
create policy "service_items_delete_admin"
  on public.service_items for delete
  using (public.has_role('admin'));
