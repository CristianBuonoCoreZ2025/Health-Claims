-- Fase 7: Operaciones avanzadas y rectificacion de perfiles.

-- Rectificacion de profiles
alter table public.profiles add column if not exists competency_level text;
alter table public.profiles add column if not exists max_load integer;
-- team_id ya existe en la creacion original; se reafirma sin FK para evitar dependencia circular

-- Asegura que liquidator_weights exista con la estructura esperada (creado en Fase 4 / 00018)
create table if not exists public.liquidator_weights (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  coverage_type_id  uuid references public.coverage_types(id) on delete cascade,
  level             integer not null default 1,
  weight_value      numeric(5, 2) not null default 1.0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid,
  constraint liquidator_weights_uniq unique (user_id, coverage_type_id, level),
  constraint liquidator_weight_chk check (weight_value >= 0)
);

-- Competencias de liquidadores
 create table if not exists public.liquidator_competencies (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  service_group_id  uuid not null references public.service_groups(id) on delete cascade,
  level             integer not null default 1,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists liquidator_competencies_user_idx on public.liquidator_competencies (user_id);
create index if not exists liquidator_competencies_group_idx on public.liquidator_competencies (service_group_id);

drop trigger if exists trg_liquidator_competencies_updated_at on public.liquidator_competencies;
create trigger trg_liquidator_competencies_updated_at
  before update on public.liquidator_competencies
  for each row execute function public.set_updated_at();

drop trigger if exists trg_liquidator_competencies_audit_user on public.liquidator_competencies;
create trigger trg_liquidator_competencies_audit_user
  before insert or update on public.liquidator_competencies
  for each row execute function public.set_audit_user();

alter table public.liquidator_competencies enable row level security;

drop policy if exists "liquidator_competencies_select_authenticated" on public.liquidator_competencies;
create policy "liquidator_competencies_select_authenticated"
  on public.liquidator_competencies for select
  using (public.current_user_id() is not null);

drop policy if exists "liquidator_competencies_insert_admin" on public.liquidator_competencies;
create policy "liquidator_competencies_insert_admin"
  on public.liquidator_competencies for insert
  with check (public.has_role('admin'));

drop policy if exists "liquidator_competencies_update_admin" on public.liquidator_competencies;
create policy "liquidator_competencies_update_admin"
  on public.liquidator_competencies for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "liquidator_competencies_delete_admin" on public.liquidator_competencies;
create policy "liquidator_competencies_delete_admin"
  on public.liquidator_competencies for delete
  using (public.has_role('admin'));

-- Topes de carga de liquidadores
 create table if not exists public.liquidator_load_caps (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  max_active_claims integer not null default 10,
  company_id        uuid references public.companies(id) on delete set null,
  coverage_type_id  uuid references public.coverage_types(id) on delete set null,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists liquidator_load_caps_user_idx on public.liquidator_load_caps (user_id);
create index if not exists liquidator_load_caps_company_idx on public.liquidator_load_caps (company_id);
create index if not exists liquidator_load_caps_coverage_idx on public.liquidator_load_caps (coverage_type_id);

drop trigger if exists trg_liquidator_load_caps_updated_at on public.liquidator_load_caps;
create trigger trg_liquidator_load_caps_updated_at
  before update on public.liquidator_load_caps
  for each row execute function public.set_updated_at();

drop trigger if exists trg_liquidator_load_caps_audit_user on public.liquidator_load_caps;
create trigger trg_liquidator_load_caps_audit_user
  before insert or update on public.liquidator_load_caps
  for each row execute function public.set_audit_user();

alter table public.liquidator_load_caps enable row level security;

drop policy if exists "liquidator_load_caps_select_authenticated" on public.liquidator_load_caps;
create policy "liquidator_load_caps_select_authenticated"
  on public.liquidator_load_caps for select
  using (public.current_user_id() is not null);

drop policy if exists "liquidator_load_caps_insert_admin" on public.liquidator_load_caps;
create policy "liquidator_load_caps_insert_admin"
  on public.liquidator_load_caps for insert
  with check (public.has_role('admin'));

drop policy if exists "liquidator_load_caps_update_admin" on public.liquidator_load_caps;
create policy "liquidator_load_caps_update_admin"
  on public.liquidator_load_caps for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "liquidator_load_caps_delete_admin" on public.liquidator_load_caps;
create policy "liquidator_load_caps_delete_admin"
  on public.liquidator_load_caps for delete
  using (public.has_role('admin'));

-- Horarios de liquidadores
 create table if not exists public.liquidator_schedules (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  day_of_week       integer not null check (day_of_week between 0 and 6),
  start_time        time not null,
  end_time          time not null,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid,
  constraint liquidator_schedules_time_chk check (end_time > start_time)
);

create index if not exists liquidator_schedules_user_idx on public.liquidator_schedules (user_id);

drop trigger if exists trg_liquidator_schedules_updated_at on public.liquidator_schedules;
create trigger trg_liquidator_schedules_updated_at
  before update on public.liquidator_schedules
  for each row execute function public.set_updated_at();

drop trigger if exists trg_liquidator_schedules_audit_user on public.liquidator_schedules;
create trigger trg_liquidator_schedules_audit_user
  before insert or update on public.liquidator_schedules
  for each row execute function public.set_audit_user();

alter table public.liquidator_schedules enable row level security;

drop policy if exists "liquidator_schedules_select_authenticated" on public.liquidator_schedules;
create policy "liquidator_schedules_select_authenticated"
  on public.liquidator_schedules for select
  using (public.current_user_id() is not null);

drop policy if exists "liquidator_schedules_insert_admin" on public.liquidator_schedules;
create policy "liquidator_schedules_insert_admin"
  on public.liquidator_schedules for insert
  with check (public.has_role('admin'));

drop policy if exists "liquidator_schedules_update_admin" on public.liquidator_schedules;
create policy "liquidator_schedules_update_admin"
  on public.liquidator_schedules for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "liquidator_schedules_delete_admin" on public.liquidator_schedules;
create policy "liquidator_schedules_delete_admin"
  on public.liquidator_schedules for delete
  using (public.has_role('admin'));

-- Reglas de reasignacion
 create table if not exists public.reassignment_rules (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  from_user_id      uuid references public.profiles(id) on delete set null,
  to_user_id        uuid references public.profiles(id) on delete set null,
  coverage_type_id  uuid references public.coverage_types(id) on delete set null,
  company_id        uuid references public.companies(id) on delete set null,
  priority          integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists reassignment_rules_from_idx on public.reassignment_rules (from_user_id);
create index if not exists reassignment_rules_to_idx on public.reassignment_rules (to_user_id);
create index if not exists reassignment_rules_priority_idx on public.reassignment_rules (priority);

drop trigger if exists trg_reassignment_rules_updated_at on public.reassignment_rules;
create trigger trg_reassignment_rules_updated_at
  before update on public.reassignment_rules
  for each row execute function public.set_updated_at();

drop trigger if exists trg_reassignment_rules_audit_user on public.reassignment_rules;
create trigger trg_reassignment_rules_audit_user
  before insert or update on public.reassignment_rules
  for each row execute function public.set_audit_user();

alter table public.reassignment_rules enable row level security;

drop policy if exists "reassignment_rules_select_authenticated" on public.reassignment_rules;
create policy "reassignment_rules_select_authenticated"
  on public.reassignment_rules for select
  using (public.current_user_id() is not null);

drop policy if exists "reassignment_rules_insert_admin" on public.reassignment_rules;
create policy "reassignment_rules_insert_admin"
  on public.reassignment_rules for insert
  with check (public.has_role('admin'));

drop policy if exists "reassignment_rules_update_admin" on public.reassignment_rules;
create policy "reassignment_rules_update_admin"
  on public.reassignment_rules for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "reassignment_rules_delete_admin" on public.reassignment_rules;
create policy "reassignment_rules_delete_admin"
  on public.reassignment_rules for delete
  using (public.has_role('admin'));

-- Descargas masivas
 create table if not exists public.batch_downloads (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  entity_type       text not null,
  status            text not null default 'pending',
  file_path         text,
  started_at        timestamptz not null default now(),
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists batch_downloads_user_idx on public.batch_downloads (user_id);

drop trigger if exists trg_batch_downloads_updated_at on public.batch_downloads;
create trigger trg_batch_downloads_updated_at
  before update on public.batch_downloads
  for each row execute function public.set_updated_at();

drop trigger if exists trg_batch_downloads_audit_user on public.batch_downloads;
create trigger trg_batch_downloads_audit_user
  before insert or update on public.batch_downloads
  for each row execute function public.set_audit_user();

alter table public.batch_downloads enable row level security;

drop policy if exists "batch_downloads_select_authenticated" on public.batch_downloads;
create policy "batch_downloads_select_authenticated"
  on public.batch_downloads for select
  using (public.current_user_id() is not null);

drop policy if exists "batch_downloads_insert_admin" on public.batch_downloads;
create policy "batch_downloads_insert_admin"
  on public.batch_downloads for insert
  with check (public.has_role('admin'));

drop policy if exists "batch_downloads_update_admin" on public.batch_downloads;
create policy "batch_downloads_update_admin"
  on public.batch_downloads for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "batch_downloads_delete_admin" on public.batch_downloads;
create policy "batch_downloads_delete_admin"
  on public.batch_downloads for delete
  using (public.has_role('admin'));

-- Plantillas de reportes
 create table if not exists public.report_templates (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  template_type     text not null,
  applies_to        text[] not null default '{}',
  file_path         text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists report_templates_type_idx on public.report_templates (template_type);

drop trigger if exists trg_report_templates_updated_at on public.report_templates;
create trigger trg_report_templates_updated_at
  before update on public.report_templates
  for each row execute function public.set_updated_at();

drop trigger if exists trg_report_templates_audit_user on public.report_templates;
create trigger trg_report_templates_audit_user
  before insert or update on public.report_templates
  for each row execute function public.set_audit_user();

alter table public.report_templates enable row level security;

drop policy if exists "report_templates_select_authenticated" on public.report_templates;
create policy "report_templates_select_authenticated"
  on public.report_templates for select
  using (public.current_user_id() is not null);

drop policy if exists "report_templates_insert_admin" on public.report_templates;
create policy "report_templates_insert_admin"
  on public.report_templates for insert
  with check (public.has_role('admin'));

drop policy if exists "report_templates_update_admin" on public.report_templates;
create policy "report_templates_update_admin"
  on public.report_templates for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "report_templates_delete_admin" on public.report_templates;
create policy "report_templates_delete_admin"
  on public.report_templates for delete
  using (public.has_role('admin'));
