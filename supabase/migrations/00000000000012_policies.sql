-- Tabla policies (polizas/contratos de seguro).
-- Enum de tipo de contrato y estado de poliza.

do $$ begin
  create type public.contract_type as enum ('individual', 'colectivo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.policy_status as enum ('vigente', 'vencida', 'anulada', 'pendiente');
exception when duplicate_object then null; end $$;

create table if not exists public.policies (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies(id) on delete restrict,
  policy_number   text not null,
  endorsement_number text not null default '0',
  start_date      date not null,
  end_date        date not null,
  holder_name     text not null,
  contract_type   public.contract_type not null default 'individual',
  status          public.policy_status not null default 'pendiente',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid,
  updated_by      uuid,
  constraint policies_end_after_start check (end_date >= start_date),
  constraint policies_policy_number_chk check (length(trim(policy_number)) > 0),
  constraint policies_holder_chk check (length(trim(holder_name)) > 0)
);

create index if not exists policies_company_id_idx    on public.policies (company_id);
create index if not exists policies_policy_number_idx on public.policies (policy_number);
create index if not exists policies_status_idx        on public.policies (status);
create index if not exists policies_start_date_idx    on public.policies (start_date);
create index if not exists policies_end_date_idx      on public.policies (end_date);
create index if not exists policies_is_active_idx     on public.policies (is_active);

drop trigger if exists trg_policies_updated_at on public.policies;
create trigger trg_policies_updated_at
  before update on public.policies
  for each row execute function public.set_updated_at();

drop trigger if exists trg_policies_audit_user on public.policies;
create trigger trg_policies_audit_user
  before insert or update on public.policies
  for each row execute function public.set_audit_user();

alter table public.policies enable row level security;

drop policy if exists "policies_select_authenticated" on public.policies;
create policy "policies_select_authenticated"
  on public.policies for select
  using (public.current_user_id() is not null);

drop policy if exists "policies_insert_admin" on public.policies;
create policy "policies_insert_admin"
  on public.policies for insert
  with check (public.has_role('admin'));

drop policy if exists "policies_update_admin" on public.policies;
create policy "policies_update_admin"
  on public.policies for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "policies_delete_admin" on public.policies;
create policy "policies_delete_admin"
  on public.policies for delete
  using (public.has_role('admin'));
