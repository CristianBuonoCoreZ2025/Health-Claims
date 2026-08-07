-- Fase 7.1: Arbol flexible de coberturas + campos faltantes de poliza + brokers.
--
-- El arbol de coberturas NO es rigido. Usa level_code numerico (10, 20, 30, 31, 40, ...)
-- que permite insertar niveles intermedios y agregar niveles adicionales.
-- Si un nivel no tiene reglas para una poliza, simplemente no existe en la tabla.
-- La liquidacion hace recursividad desde el nivel mas alto configurado.

-- =====================================
-- 1. Brokers / Corredores
-- =====================================
create table if not exists public.brokers (
  id          uuid primary key default gen_random_uuid(),
  code        text not null,
  name        text not null,
  tax_id      text,
  email       text,
  phone       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint brokers_code_chk check (length(trim(code)) > 0),
  constraint brokers_name_chk check (length(trim(name)) > 0)
);

create index if not exists brokers_code_idx on public.brokers (code);
create index if not exists brokers_name_idx on public.brokers (name);
create index if not exists brokers_is_active_idx on public.brokers (is_active);

drop trigger if exists trg_brokers_updated_at on public.brokers;
create trigger trg_brokers_updated_at
  before update on public.brokers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_brokers_audit_user on public.brokers;
create trigger trg_brokers_audit_user
  before insert or update on public.brokers
  for each row execute function public.set_audit_user();

alter table public.brokers enable row level security;

drop policy if exists "brokers_select_authenticated" on public.brokers;
create policy "brokers_select_authenticated"
  on public.brokers for select
  using (public.current_user_id() is not null);

drop policy if exists "brokers_insert_admin" on public.brokers;
create policy "brokers_insert_admin"
  on public.brokers for insert
  with check (public.has_role('admin'));

drop policy if exists "brokers_update_admin" on public.brokers;
create policy "brokers_update_admin"
  on public.brokers for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "brokers_delete_admin" on public.brokers;
create policy "brokers_delete_admin"
  on public.brokers for delete
  using (public.has_role('admin'));

-- =====================================
-- 2. Campos faltantes en policies
-- =====================================
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'broker_id'
  ) then
    alter table public.policies add column broker_id uuid;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'sponsor'
  ) then
    alter table public.policies add column sponsor text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'policy_type'
  ) then
    alter table public.policies add column policy_type text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'branch_id'
  ) then
    alter table public.policies add column branch_id uuid;
  end if;
end $$;

alter table public.policies
  drop constraint if exists policies_broker_id_fkey;
alter table public.policies
  add constraint policies_broker_id_fkey
  foreign key (broker_id) references public.brokers(id) on delete set null;

alter table public.policies
  drop constraint if exists policies_branch_id_fkey;
alter table public.policies
  add constraint policies_branch_id_fkey
  foreign key (branch_id) references public.company_branches(id) on delete set null;

create index if not exists policies_broker_id_idx on public.policies (broker_id);
create index if not exists policies_branch_id_idx on public.policies (branch_id);

-- =====================================
-- 3. Arbol flexible de coberturas (policy_tree_nodes)
--
-- level_code usa incrementos de 10 para niveles estandar:
--   10 = Poliza
--   20 = Plan
--   30 = Tipo Cobertura
--   40 = Cobertura
--   50 = Agrupacion de Prestaciones
--   60 = Sub-agrupacion de Prestaciones
--   70 = Prestacion especifica
--
-- Se pueden insertar niveles intermedios (31, 32, 33...) y adicionales (80, 90...).
-- Si un nivel no tiene reglas para una poliza, no se crea el nodo.
-- =====================================
create table if not exists public.policy_tree_nodes (
  id          uuid primary key default gen_random_uuid(),
  policy_id   uuid not null references public.policies(id) on delete cascade,
  parent_id   uuid references public.policy_tree_nodes(id) on delete cascade,
  level_code  int not null,
  node_type   text not null,
  code        text,
  name        text not null,
  description text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  metadata    jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint policy_tree_nodes_level_chk check (level_code > 0),
  constraint policy_tree_nodes_type_chk check (length(trim(node_type)) > 0),
  constraint policy_tree_nodes_name_chk check (length(trim(name)) > 0)
);

create index if not exists policy_tree_nodes_policy_idx on public.policy_tree_nodes (policy_id);
create index if not exists policy_tree_nodes_parent_idx on public.policy_tree_nodes (parent_id);
create index if not exists policy_tree_nodes_level_idx on public.policy_tree_nodes (level_code);
create index if not exists policy_tree_nodes_type_idx on public.policy_tree_nodes (node_type);
create index if not exists policy_tree_nodes_active_idx on public.policy_tree_nodes (is_active);

drop trigger if exists trg_policy_tree_nodes_updated_at on public.policy_tree_nodes;
create trigger trg_policy_tree_nodes_updated_at
  before update on public.policy_tree_nodes
  for each row execute function public.set_updated_at();

drop trigger if exists trg_policy_tree_nodes_audit_user on public.policy_tree_nodes;
create trigger trg_policy_tree_nodes_audit_user
  before insert or update on public.policy_tree_nodes
  for each row execute function public.set_audit_user();

alter table public.policy_tree_nodes enable row level security;

drop policy if exists "policy_tree_nodes_select_authenticated" on public.policy_tree_nodes;
create policy "policy_tree_nodes_select_authenticated"
  on public.policy_tree_nodes for select
  using (public.current_user_id() is not null);

drop policy if exists "policy_tree_nodes_insert_admin" on public.policy_tree_nodes;
create policy "policy_tree_nodes_insert_admin"
  on public.policy_tree_nodes for insert
  with check (public.has_role('admin'));

drop policy if exists "policy_tree_nodes_update_admin" on public.policy_tree_nodes;
create policy "policy_tree_nodes_update_admin"
  on public.policy_tree_nodes for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "policy_tree_nodes_delete_admin" on public.policy_tree_nodes;
create policy "policy_tree_nodes_delete_admin"
  on public.policy_tree_nodes for delete
  using (public.has_role('admin'));

-- =====================================
-- 4. Condiciones del arbol (policy_tree_conditions)
--
-- Cada condicion se ancla a un nodo del arbol.
-- Si un nodo no tiene condiciones, no se crea registro.
-- =====================================
create table if not exists public.policy_tree_conditions (
  id                    uuid primary key default gen_random_uuid(),
  node_id               uuid not null references public.policy_tree_nodes(id) on delete cascade,
  condition_type        text not null,
  name                  text not null,
  yearly_limit          numeric(18,2),
  per_event_limit       numeric(18,2),
  lifetime_limit        numeric(18,2),
  deductible_amount     numeric(18,2),
  deductible_percentage numeric(5,2),
  copay_percentage      numeric(5,2),
  waiting_period_days   int,
  currency_id           uuid references public.currencies(id) on delete set null,
  frequency             text,
  effective_date        date,
  end_date              date,
  rules                 jsonb,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid,
  updated_by            uuid,
  constraint policy_tree_conditions_type_chk check (length(trim(condition_type)) > 0),
  constraint policy_tree_conditions_name_chk check (length(trim(name)) > 0),
  constraint policy_tree_conditions_pct_chk check (
    deductible_percentage is null or (deductible_percentage >= 0 and deductible_percentage <= 100)
  ),
  constraint policy_tree_conditions_copay_chk check (
    copay_percentage is null or (copay_percentage >= 0 and copay_percentage <= 100)
  )
);

create index if not exists policy_tree_conditions_node_idx on public.policy_tree_conditions (node_id);
create index if not exists policy_tree_conditions_type_idx on public.policy_tree_conditions (condition_type);
create index if not exists policy_tree_conditions_currency_idx on public.policy_tree_conditions (currency_id);
create index if not exists policy_tree_conditions_active_idx on public.policy_tree_conditions (is_active);

drop trigger if exists trg_policy_tree_conditions_updated_at on public.policy_tree_conditions;
create trigger trg_policy_tree_conditions_updated_at
  before update on public.policy_tree_conditions
  for each row execute function public.set_updated_at();

drop trigger if exists trg_policy_tree_conditions_audit_user on public.policy_tree_conditions;
create trigger trg_policy_tree_conditions_audit_user
  before insert or update on public.policy_tree_conditions
  for each row execute function public.set_audit_user();

alter table public.policy_tree_conditions enable row level security;

drop policy if exists "policy_tree_conditions_select_authenticated" on public.policy_tree_conditions;
create policy "policy_tree_conditions_select_authenticated"
  on public.policy_tree_conditions for select
  using (public.current_user_id() is not null);

drop policy if exists "policy_tree_conditions_insert_admin" on public.policy_tree_conditions;
create policy "policy_tree_conditions_insert_admin"
  on public.policy_tree_conditions for insert
  with check (public.has_role('admin'));

drop policy if exists "policy_tree_conditions_update_admin" on public.policy_tree_conditions;
create policy "policy_tree_conditions_update_admin"
  on public.policy_tree_conditions for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "policy_tree_conditions_delete_admin" on public.policy_tree_conditions;
create policy "policy_tree_conditions_delete_admin"
  on public.policy_tree_conditions for delete
  using (public.has_role('admin'));
