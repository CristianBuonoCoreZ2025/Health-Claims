-- Fase 3: Endosos y versionado de polizas.

-- =====================================
-- 1. Endosos
-- =====================================
create table if not exists public.policy_endorsements (
  id                  uuid primary key default gen_random_uuid(),
  policy_id           uuid not null references public.policies(id) on delete cascade,
  endorsement_number  text not null,
  endorsement_type    text not null,
  start_date          date not null,
  end_date            date,
  status              text not null default 'borrador',
  notes               text,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid,
  updated_by          uuid,
  constraint policy_endorsements_type_chk check (
    endorsement_type in ('aditivo', 'sustitutivo', 'modificacion', 'eliminacion')
  ),
  constraint policy_endorsements_number_chk check (length(trim(endorsement_number)) > 0)
);

create index if not exists policy_endorsements_policy_id_idx on public.policy_endorsements (policy_id);
create index if not exists policy_endorsements_number_idx on public.policy_endorsements (endorsement_number);
create index if not exists policy_endorsements_type_idx on public.policy_endorsements (endorsement_type);
create index if not exists policy_endorsements_status_idx on public.policy_endorsements (status);

drop trigger if exists trg_policy_endorsements_updated_at on public.policy_endorsements;
create trigger trg_policy_endorsements_updated_at
  before update on public.policy_endorsements
  for each row execute function public.set_updated_at();

drop trigger if exists trg_policy_endorsements_audit_user on public.policy_endorsements;
create trigger trg_policy_endorsements_audit_user
  before insert or update on public.policy_endorsements
  for each row execute function public.set_audit_user();

alter table public.policy_endorsements enable row level security;

drop policy if exists "policy_endorsements_select_staff" on public.policy_endorsements;
create policy "policy_endorsements_select_staff"
  on public.policy_endorsements for select
  using (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidator')
  );

drop policy if exists "policy_endorsements_insert_admin" on public.policy_endorsements;
create policy "policy_endorsements_insert_admin"
  on public.policy_endorsements for insert
  with check (public.has_role('admin'));

drop policy if exists "policy_endorsements_update_admin" on public.policy_endorsements;
create policy "policy_endorsements_update_admin"
  on public.policy_endorsements for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "policy_endorsements_delete_admin" on public.policy_endorsements;
create policy "policy_endorsements_delete_admin"
  on public.policy_endorsements for delete
  using (public.has_role('admin'));

-- =====================================
-- 2. Rectificacion de policies
-- =====================================
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'is_master'
  ) then
    alter table public.policies add column is_master boolean not null default false;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'master_policy_id'
  ) then
    alter table public.policies add column master_policy_id uuid;
    alter table public.policies
      add constraint policies_master_policy_id_fkey
      foreign key (master_policy_id) references public.policies(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policies' and column_name = 'version'
  ) then
    alter table public.policies add column version integer not null default 1;
  end if;
end $$;

create index if not exists policies_master_policy_id_idx on public.policies (master_policy_id);
create index if not exists policies_is_master_idx on public.policies (is_master);
create index if not exists policies_version_idx on public.policies (version);

-- =====================================
-- 3. Rectificacion de policy_conditions
-- =====================================
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'policy_conditions' and column_name = 'endorsement_id'
  ) then
    alter table public.policy_conditions add column endorsement_id uuid;
    alter table public.policy_conditions
      add constraint policy_conditions_endorsement_id_fkey
      foreign key (endorsement_id) references public.policy_endorsements(id) on delete set null;
  end if;
end $$;

create index if not exists policy_conditions_endorsement_id_idx on public.policy_conditions (endorsement_id);
