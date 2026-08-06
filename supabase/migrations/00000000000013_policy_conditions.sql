-- Tabla policy_conditions (condiciones particulares de una poliza).
-- Define topes, deducibles y copagos por tipo de cobertura.

create table if not exists public.policy_conditions (
  id                    uuid primary key default gen_random_uuid(),
  policy_id             uuid not null references public.policies(id) on delete cascade,
  coverage_type_id      uuid not null references public.coverage_types(id) on delete restrict,
  event_limit           numeric(12, 2) not null default 0,
  yearly_limit          numeric(12, 2) not null default 0,
  deductible_percentage numeric(5, 2) not null default 0,
  copayment_percentage  numeric(5, 2) not null default 0,
  waiting_period_days   integer not null default 0,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid,
  updated_by            uuid,
  constraint policy_conditions_uniq unique (policy_id, coverage_type_id),
  constraint pc_event_limit_chk check (event_limit >= 0),
  constraint pc_yearly_limit_chk check (yearly_limit >= 0),
  constraint pc_deductible_chk check (deductible_percentage >= 0 and deductible_percentage <= 100),
  constraint pc_copayment_chk check (copayment_percentage >= 0 and copayment_percentage <= 100),
  constraint pc_waiting_chk check (waiting_period_days >= 0)
);

create index if not exists policy_conditions_policy_id_idx        on public.policy_conditions (policy_id);
create index if not exists policy_conditions_coverage_type_id_idx on public.policy_conditions (coverage_type_id);

drop trigger if exists trg_policy_conditions_updated_at on public.policy_conditions;
create trigger trg_policy_conditions_updated_at
  before update on public.policy_conditions
  for each row execute function public.set_updated_at();

drop trigger if exists trg_policy_conditions_audit_user on public.policy_conditions;
create trigger trg_policy_conditions_audit_user
  before insert or update on public.policy_conditions
  for each row execute function public.set_audit_user();

alter table public.policy_conditions enable row level security;

drop policy if exists "policy_conditions_select_authenticated" on public.policy_conditions;
create policy "policy_conditions_select_authenticated"
  on public.policy_conditions for select
  using (public.current_user_id() is not null);

drop policy if exists "policy_conditions_insert_admin" on public.policy_conditions;
create policy "policy_conditions_insert_admin"
  on public.policy_conditions for insert
  with check (public.has_role('admin'));

drop policy if exists "policy_conditions_update_admin" on public.policy_conditions;
create policy "policy_conditions_update_admin"
  on public.policy_conditions for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "policy_conditions_delete_admin" on public.policy_conditions;
create policy "policy_conditions_delete_admin"
  on public.policy_conditions for delete
  using (public.has_role('admin'));
