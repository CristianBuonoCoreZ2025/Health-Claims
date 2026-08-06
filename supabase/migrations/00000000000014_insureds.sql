-- Tabla insureds (asegurados: titulares y cargas/beneficiarios).
-- Enum de tipo de relacion y genero.

do $$ begin
  create type public.relationship_type as enum ('titular', 'conyuge', 'hijo', 'otro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gender_type as enum ('masculino', 'femenino', 'otro');
exception when duplicate_object then null; end $$;

create table if not exists public.insureds (
  id              uuid primary key default gen_random_uuid(),
  policy_id       uuid not null references public.policies(id) on delete cascade,
  rut             text not null,
  first_name      text not null,
  last_name       text not null,
  birth_date      date,
  gender          public.gender_type,
  relationship    public.relationship_type not null default 'titular',
  email           text,
  phone           text,
  is_titular      boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid,
  updated_by      uuid,
  constraint insureds_rut_chk check (length(trim(rut)) > 0),
  constraint insureds_first_name_chk check (length(trim(first_name)) > 0),
  constraint insureds_last_name_chk check (length(trim(last_name)) > 0)
);

create index if not exists insureds_policy_id_idx   on public.insureds (policy_id);
create index if not exists insureds_rut_idx         on public.insureds (rut);
create index if not exists insureds_is_titular_idx  on public.insureds (is_titular);
create index if not exists insureds_is_active_idx   on public.insureds (is_active);
create index if not exists insureds_name_trgm_idx   on public.insureds using gin (first_name gin_trgm_ops);
create index if not exists insureds_lastname_trgm_idx on public.insureds using gin (last_name gin_trgm_ops);

drop trigger if exists trg_insureds_updated_at on public.insureds;
create trigger trg_insureds_updated_at
  before update on public.insureds
  for each row execute function public.set_updated_at();

drop trigger if exists trg_insureds_audit_user on public.insureds;
create trigger trg_insureds_audit_user
  before insert or update on public.insureds
  for each row execute function public.set_audit_user();

alter table public.insureds enable row level security;

drop policy if exists "insureds_select_authenticated" on public.insureds;
create policy "insureds_select_authenticated"
  on public.insureds for select
  using (public.current_user_id() is not null);

drop policy if exists "insureds_insert_admin" on public.insureds;
create policy "insureds_insert_admin"
  on public.insureds for insert
  with check (public.has_role('admin'));

drop policy if exists "insureds_update_admin" on public.insureds;
create policy "insureds_update_admin"
  on public.insureds for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "insureds_delete_admin" on public.insureds;
create policy "insureds_delete_admin"
  on public.insureds for delete
  using (public.has_role('admin'));

-- Sub-tabla: pre_existing_conditions (pre-existencias del asegurado).
create table if not exists public.pre_existing_conditions (
  id          uuid primary key default gen_random_uuid(),
  insured_id  uuid not null references public.insureds(id) on delete cascade,
  name        text not null,
  description text,
  diagnosed_date date,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint pre_existing_name_chk check (length(trim(name)) > 0)
);

create index if not exists pre_existing_insured_id_idx on public.pre_existing_conditions (insured_id);

drop trigger if exists trg_pre_existing_updated_at on public.pre_existing_conditions;
create trigger trg_pre_existing_updated_at
  before update on public.pre_existing_conditions
  for each row execute function public.set_updated_at();

drop trigger if exists trg_pre_existing_audit_user on public.pre_existing_conditions;
create trigger trg_pre_existing_audit_user
  before insert or update on public.pre_existing_conditions
  for each row execute function public.set_audit_user();

alter table public.pre_existing_conditions enable row level security;

drop policy if exists "pre_existing_select_authenticated" on public.pre_existing_conditions;
create policy "pre_existing_select_authenticated"
  on public.pre_existing_conditions for select
  using (public.current_user_id() is not null);

drop policy if exists "pre_existing_insert_admin" on public.pre_existing_conditions;
create policy "pre_existing_insert_admin"
  on public.pre_existing_conditions for insert
  with check (public.has_role('admin'));

drop policy if exists "pre_existing_update_admin" on public.pre_existing_conditions;
create policy "pre_existing_update_admin"
  on public.pre_existing_conditions for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "pre_existing_delete_admin" on public.pre_existing_conditions;
create policy "pre_existing_delete_admin"
  on public.pre_existing_conditions for delete
  using (public.has_role('admin'));

-- Sub-tabla: insured_addresses (direcciones del asegurado).
create table if not exists public.insured_addresses (
  id          uuid primary key default gen_random_uuid(),
  insured_id  uuid not null references public.insureds(id) on delete cascade,
  label       text not null default 'principal',
  street      text not null,
  city        text,
  region      text,
  postal_code text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint insured_addresses_street_chk check (length(trim(street)) > 0)
);

create index if not exists insured_addresses_insured_id_idx on public.insured_addresses (insured_id);

drop trigger if exists trg_insured_addresses_updated_at on public.insured_addresses;
create trigger trg_insured_addresses_updated_at
  before update on public.insured_addresses
  for each row execute function public.set_updated_at();

drop trigger if exists trg_insured_addresses_audit_user on public.insured_addresses;
create trigger trg_insured_addresses_audit_user
  before insert or update on public.insured_addresses
  for each row execute function public.set_audit_user();

alter table public.insured_addresses enable row level security;

drop policy if exists "insured_addresses_select_authenticated" on public.insured_addresses;
create policy "insured_addresses_select_authenticated"
  on public.insured_addresses for select
  using (public.current_user_id() is not null);

drop policy if exists "insured_addresses_insert_admin" on public.insured_addresses;
create policy "insured_addresses_insert_admin"
  on public.insured_addresses for insert
  with check (public.has_role('admin'));

drop policy if exists "insured_addresses_update_admin" on public.insured_addresses;
create policy "insured_addresses_update_admin"
  on public.insured_addresses for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "insured_addresses_delete_admin" on public.insured_addresses;
create policy "insured_addresses_delete_admin"
  on public.insured_addresses for delete
  using (public.has_role('admin'));

-- Sub-tabla: insured_bank_accounts (cuentas bancarias del asegurado).
create table if not exists public.insured_bank_accounts (
  id            uuid primary key default gen_random_uuid(),
  insured_id    uuid not null references public.insureds(id) on delete cascade,
  bank_name     text not null,
  account_number text not null,
  account_type  text not null default 'corriente',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint insured_bank_name_chk check (length(trim(bank_name)) > 0),
  constraint insured_bank_account_chk check (length(trim(account_number)) > 0)
);

create index if not exists insured_bank_accounts_insured_id_idx on public.insured_bank_accounts (insured_id);

drop trigger if exists trg_insured_bank_accounts_updated_at on public.insured_bank_accounts;
create trigger trg_insured_bank_accounts_updated_at
  before update on public.insured_bank_accounts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_insured_bank_accounts_audit_user on public.insured_bank_accounts;
create trigger trg_insured_bank_accounts_audit_user
  before insert or update on public.insured_bank_accounts
  for each row execute function public.set_audit_user();

alter table public.insured_bank_accounts enable row level security;

drop policy if exists "insured_bank_accounts_select_authenticated" on public.insured_bank_accounts;
create policy "insured_bank_accounts_select_authenticated"
  on public.insured_bank_accounts for select
  using (public.current_user_id() is not null);

drop policy if exists "insured_bank_accounts_insert_admin" on public.insured_bank_accounts;
create policy "insured_bank_accounts_insert_admin"
  on public.insured_bank_accounts for insert
  with check (public.has_role('admin'));

drop policy if exists "insured_bank_accounts_update_admin" on public.insured_bank_accounts;
create policy "insured_bank_accounts_update_admin"
  on public.insured_bank_accounts for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "insured_bank_accounts_delete_admin" on public.insured_bank_accounts;
create policy "insured_bank_accounts_delete_admin"
  on public.insured_bank_accounts for delete
  using (public.has_role('admin'));
