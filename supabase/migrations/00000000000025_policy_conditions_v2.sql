-- Fase 4.2: Motor de condiciones particulares N2/N5.

-- =====================================
-- 1. Asegurar RLS base de coverage_types
-- =====================================
alter table public.coverage_types enable row level security;

drop policy if exists "coverage_types_select_authenticated" on public.coverage_types;
create policy "coverage_types_select_authenticated"
  on public.coverage_types for select
  using (public.current_user_id() is not null);

drop policy if exists "coverage_types_insert_admin" on public.coverage_types;
create policy "coverage_types_insert_admin"
  on public.coverage_types for insert
  with check (public.has_role('admin'));

drop policy if exists "coverage_types_update_admin" on public.coverage_types;
create policy "coverage_types_update_admin"
  on public.coverage_types for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "coverage_types_delete_admin" on public.coverage_types;
create policy "coverage_types_delete_admin"
  on public.coverage_types for delete
  using (public.has_role('admin'));

-- =====================================
-- 2. Cabeceras de condiciones
-- =====================================
create table if not exists public.policy_condition_headers (
  id              uuid primary key default gen_random_uuid(),
  policy_id       uuid not null references public.policies(id) on delete cascade,
  endorsement_id  uuid references public.policy_endorsements(id) on delete set null,
  name            text not null,
  condition_type  text not null,
  effective_date  date not null,
  expiration_date date,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid,
  updated_by      uuid,
  constraint policy_condition_headers_name_chk check (length(trim(name)) > 0),
  constraint policy_condition_headers_type_chk check (length(trim(condition_type)) > 0)
);

create index if not exists policy_condition_headers_policy_idx on public.policy_condition_headers (policy_id);
create index if not exists policy_condition_headers_endorsement_idx on public.policy_condition_headers (endorsement_id);
create index if not exists policy_condition_headers_effective_idx on public.policy_condition_headers (effective_date);
create index if not exists policy_condition_headers_is_active_idx on public.policy_condition_headers (is_active);

drop trigger if exists trg_policy_condition_headers_updated_at on public.policy_condition_headers;
create trigger trg_policy_condition_headers_updated_at
  before update on public.policy_condition_headers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_policy_condition_headers_audit_user on public.policy_condition_headers;
create trigger trg_policy_condition_headers_audit_user
  before insert or update on public.policy_condition_headers
  for each row execute function public.set_audit_user();

alter table public.policy_condition_headers enable row level security;

drop policy if exists "policy_condition_headers_select_authenticated" on public.policy_condition_headers;
create policy "policy_condition_headers_select_authenticated"
  on public.policy_condition_headers for select
  using (public.current_user_id() is not null);

drop policy if exists "policy_condition_headers_insert_admin" on public.policy_condition_headers;
create policy "policy_condition_headers_insert_admin"
  on public.policy_condition_headers for insert
  with check (public.has_role('admin'));

drop policy if exists "policy_condition_headers_update_admin" on public.policy_condition_headers;
create policy "policy_condition_headers_update_admin"
  on public.policy_condition_headers for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "policy_condition_headers_delete_admin" on public.policy_condition_headers;
create policy "policy_condition_headers_delete_admin"
  on public.policy_condition_headers for delete
  using (public.has_role('admin'));

-- =====================================
-- 3. Lineas del motor de condiciones
-- =====================================
create table if not exists public.policy_condition_lines (
  id                        uuid primary key default gen_random_uuid(),
  policy_condition_header_id uuid not null references public.policy_condition_headers(id) on delete cascade,
  coverage_type_id          uuid references public.coverage_types(id) on delete set null,
  service_group_id          uuid references public.service_groups(id) on delete set null,
  service_subgroup_id       uuid references public.service_subgroups(id) on delete set null,
  service_item_id           uuid references public.service_items(id) on delete set null,
  classification            text,
  status                    text,
  sub_policy                text,
  sub_endorsement           text,
  associated_balance        text,
  catastrophic              boolean,
  cat_extension             text,
  branch                    text,
  fld                       numeric,
  fsl                       numeric,
  free_doctor               boolean,
  franchise                 numeric,
  imed_range                text,
  medipass_range            text,
  web_reimbursement_range   text,
  financier_range           text,
  premium_currency          text,
  capita                    numeric,
  premium                   numeric,
  loads                     numeric,
  evaluate_by               text,
  isapre_bm_amount          numeric,
  isapre_bm_percentage      numeric,
  isapre_bm_code            text,
  fonasa_bm_amount          numeric,
  fonasa_bm_percentage      numeric,
  fonasa_bm_code            text,
  pharmacy_limit            numeric,
  preferential_provider     boolean,
  limit_and_deductible      text,
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  created_by                uuid,
  updated_by                uuid
);

create index if not exists policy_condition_lines_header_idx on public.policy_condition_lines (policy_condition_header_id);
create index if not exists policy_condition_lines_coverage_idx on public.policy_condition_lines (coverage_type_id);
create index if not exists policy_condition_lines_service_group_idx on public.policy_condition_lines (service_group_id);
create index if not exists policy_condition_lines_service_subgroup_idx on public.policy_condition_lines (service_subgroup_id);
create index if not exists policy_condition_lines_service_item_idx on public.policy_condition_lines (service_item_id);
create index if not exists policy_condition_lines_is_active_idx on public.policy_condition_lines (is_active);

drop trigger if exists trg_policy_condition_lines_updated_at on public.policy_condition_lines;
create trigger trg_policy_condition_lines_updated_at
  before update on public.policy_condition_lines
  for each row execute function public.set_updated_at();

drop trigger if exists trg_policy_condition_lines_audit_user on public.policy_condition_lines;
create trigger trg_policy_condition_lines_audit_user
  before insert or update on public.policy_condition_lines
  for each row execute function public.set_audit_user();

alter table public.policy_condition_lines enable row level security;

drop policy if exists "policy_condition_lines_select_authenticated" on public.policy_condition_lines;
create policy "policy_condition_lines_select_authenticated"
  on public.policy_condition_lines for select
  using (public.current_user_id() is not null);

drop policy if exists "policy_condition_lines_insert_admin" on public.policy_condition_lines;
create policy "policy_condition_lines_insert_admin"
  on public.policy_condition_lines for insert
  with check (public.has_role('admin'));

drop policy if exists "policy_condition_lines_update_admin" on public.policy_condition_lines;
create policy "policy_condition_lines_update_admin"
  on public.policy_condition_lines for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "policy_condition_lines_delete_admin" on public.policy_condition_lines;
create policy "policy_condition_lines_delete_admin"
  on public.policy_condition_lines for delete
  using (public.has_role('admin'));
