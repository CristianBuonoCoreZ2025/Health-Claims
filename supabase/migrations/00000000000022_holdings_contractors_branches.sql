-- Fase 2: Holdings, contratantes y filiales.

-- =====================================
-- 1. Holdings
-- =====================================
create table if not exists public.holdings (
  id              uuid primary key default gen_random_uuid(),
  rut             text not null,
  business_name   text not null,
  email           text,
  phone           text,
  address         text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid,
  updated_by      uuid,
  constraint holdings_rut_chk check (length(trim(rut)) > 0),
  constraint holdings_business_name_chk check (length(trim(business_name)) > 0),
  constraint holdings_email_chk check (email is null or email ~* '^[^@]+@[^@]+\.[^@]+$')
);

create index if not exists holdings_rut_idx on public.holdings (rut);
create index if not exists holdings_business_name_idx on public.holdings (business_name);
create index if not exists holdings_is_active_idx on public.holdings (is_active);

drop trigger if exists trg_holdings_updated_at on public.holdings;
create trigger trg_holdings_updated_at
  before update on public.holdings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_holdings_audit_user on public.holdings;
create trigger trg_holdings_audit_user
  before insert or update on public.holdings
  for each row execute function public.set_audit_user();

alter table public.holdings enable row level security;

drop policy if exists "holdings_select_authenticated" on public.holdings;
create policy "holdings_select_authenticated"
  on public.holdings for select
  using (public.current_user_id() is not null);

drop policy if exists "holdings_insert_admin" on public.holdings;
create policy "holdings_insert_admin"
  on public.holdings for insert
  with check (public.has_role('admin'));

drop policy if exists "holdings_update_admin" on public.holdings;
create policy "holdings_update_admin"
  on public.holdings for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "holdings_delete_admin" on public.holdings;
create policy "holdings_delete_admin"
  on public.holdings for delete
  using (public.has_role('admin'));

-- =====================================
-- 2. Contractors
-- =====================================
create table if not exists public.contractors (
  id              uuid primary key default gen_random_uuid(),
  holding_id      uuid references public.holdings(id) on delete set null,
  name            text not null,
  rut             text,
  email           text,
  phone           text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid,
  updated_by      uuid,
  constraint contractors_name_chk check (length(trim(name)) > 0),
  constraint contractors_email_chk check (email is null or email ~* '^[^@]+@[^@]+\.[^@]+$')
);

create index if not exists contractors_holding_id_idx on public.contractors (holding_id);
create index if not exists contractors_name_idx on public.contractors (name);
create index if not exists contractors_is_active_idx on public.contractors (is_active);

drop trigger if exists trg_contractors_updated_at on public.contractors;
create trigger trg_contractors_updated_at
  before update on public.contractors
  for each row execute function public.set_updated_at();

drop trigger if exists trg_contractors_audit_user on public.contractors;
create trigger trg_contractors_audit_user
  before insert or update on public.contractors
  for each row execute function public.set_audit_user();

alter table public.contractors enable row level security;

drop policy if exists "contractors_select_authenticated" on public.contractors;
create policy "contractors_select_authenticated"
  on public.contractors for select
  using (public.current_user_id() is not null);

drop policy if exists "contractors_insert_admin" on public.contractors;
create policy "contractors_insert_admin"
  on public.contractors for insert
  with check (public.has_role('admin'));

drop policy if exists "contractors_update_admin" on public.contractors;
create policy "contractors_update_admin"
  on public.contractors for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "contractors_delete_admin" on public.contractors;
create policy "contractors_delete_admin"
  on public.contractors for delete
  using (public.has_role('admin'));

-- =====================================
-- 3. Company branches
-- =====================================
create table if not exists public.company_branches (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies(id) on delete cascade,
  name            text not null,
  code            text,
  address         text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid,
  updated_by      uuid,
  constraint company_branches_name_chk check (length(trim(name)) > 0),
  constraint company_branches_company_code unique (company_id, code)
);

create index if not exists company_branches_company_id_idx on public.company_branches (company_id);
create index if not exists company_branches_name_idx on public.company_branches (name);
create index if not exists company_branches_is_active_idx on public.company_branches (is_active);

drop trigger if exists trg_company_branches_updated_at on public.company_branches;
create trigger trg_company_branches_updated_at
  before update on public.company_branches
  for each row execute function public.set_updated_at();

drop trigger if exists trg_company_branches_audit_user on public.company_branches;
create trigger trg_company_branches_audit_user
  before insert or update on public.company_branches
  for each row execute function public.set_audit_user();

alter table public.company_branches enable row level security;

drop policy if exists "company_branches_select_authenticated" on public.company_branches;
create policy "company_branches_select_authenticated"
  on public.company_branches for select
  using (public.current_user_id() is not null);

drop policy if exists "company_branches_insert_admin" on public.company_branches;
create policy "company_branches_insert_admin"
  on public.company_branches for insert
  with check (public.has_role('admin'));

drop policy if exists "company_branches_update_admin" on public.company_branches;
create policy "company_branches_update_admin"
  on public.company_branches for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "company_branches_delete_admin" on public.company_branches;
create policy "company_branches_delete_admin"
  on public.company_branches for delete
  using (public.has_role('admin'));

-- =====================================
-- 4. Rectificacion de companies (holding_id -> holdings)
-- =====================================
-- Limpia valores previos para evitar violacion de FK con la nueva tabla vacia.
update public.companies set holding_id = null where holding_id is not null;

alter table public.companies drop constraint if exists companies_holding_id_fkey;
alter table public.companies
  add constraint companies_holding_id_fkey
  foreign key (holding_id) references public.holdings(id) on delete set null;

-- =====================================
-- 5. Rectificacion de policies (contractor_id)
-- =====================================
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'contractor_id'
  ) then
    alter table public.policies add column contractor_id uuid;
    alter table public.policies
      add constraint policies_contractor_id_fkey
      foreign key (contractor_id) references public.contractors(id) on delete set null;
  end if;
end $$;

create index if not exists policies_contractor_id_idx on public.policies (contractor_id);
