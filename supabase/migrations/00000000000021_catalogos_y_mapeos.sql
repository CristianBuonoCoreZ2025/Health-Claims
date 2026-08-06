-- Fase 1: Catalogos extendidos y mapeos por compania.

-- =====================================
-- 1. Catalogos maestros
-- =====================================

-- Paises
create table if not exists public.countries (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  name          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

create index if not exists countries_code_idx on public.countries (code);

-- Regiones
create table if not exists public.regions (
  id            uuid primary key default gen_random_uuid(),
  country_id    uuid not null references public.countries(id) on delete restrict,
  code          text not null,
  name          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint regions_code_country unique (country_id, code)
);

create index if not exists regions_country_id_idx on public.regions (country_id);

-- Monedas
create table if not exists public.currencies (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  name          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

-- Bancos
create table if not exists public.banks (
  id            uuid primary key default gen_random_uuid(),
  code          text not null,
  name          text not null,
  abbreviation  text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint banks_code unique (code)
);

-- Laboratorios
create table if not exists public.laboratories (
  id            uuid primary key default gen_random_uuid(),
  code          text not null,
  name          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint laboratories_code unique (code)
);

-- Farmacias
create table if not exists public.pharmacies (
  id            uuid primary key default gen_random_uuid(),
  code          text,
  name          text not null,
  provider_id   uuid references public.providers(id) on delete set null,
  description   text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

create index if not exists pharmacies_provider_id_idx on public.pharmacies (provider_id);

-- Isapres
create table if not exists public.isapres (
  id            uuid primary key default gen_random_uuid(),
  rut           text not null,
  code          text not null,
  name          text not null,
  description   text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint isapres_rut unique (rut),
  constraint isapres_code unique (code)
);

-- Planes Isapre
create table if not exists public.isapre_plans (
  id            uuid primary key default gen_random_uuid(),
  isapre_id     uuid not null references public.isapres(id) on delete cascade,
  code          text not null,
  name          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint isapre_plans_isapre_code unique (isapre_id, code)
);

create index if not exists isapre_plans_isapre_id_idx on public.isapre_plans (isapre_id);

-- Vademecum
create table if not exists public.vademecum (
  id                  uuid primary key default gen_random_uuid(),
  code                text not null,
  name                text not null,
  description         text,
  active_ingredient   text,
  laboratory_id       uuid references public.laboratories(id) on delete set null,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid,
  updated_by          uuid,
  constraint vademecum_code unique (code)
);

create index if not exists vademecum_laboratory_id_idx on public.vademecum (laboratory_id);

-- Tipos de documento
create table if not exists public.document_types (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  name          text not null,
  applies_to    text[] not null default '{}',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

-- Formas de pago
create table if not exists public.payment_methods (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  name          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

-- Especialidades
create table if not exists public.specialties (
  id            uuid primary key default gen_random_uuid(),
  code          text,
  name          text not null,
  description   text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

create index if not exists specialties_name_idx on public.specialties using gin (name gin_trgm_ops);

-- Parentesco / relacion
create table if not exists public.parent_relationships (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  name          text not null,
  min_age_years integer default 0,
  min_age_days  integer default 0,
  max_age_years integer,
  max_age_days  integer,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

-- Estados de liquidacion
create table if not exists public.liquidation_statuses (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  name          text not null,
  is_final      boolean not null default false,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

-- Motivos pendientes
create table if not exists public.pending_reasons (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  name          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

-- Campanas de envio
create table if not exists public.dispatch_campaigns (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  dispatch_date date,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

-- =====================================
-- 2. Datos iniciales
-- =====================================

insert into public.currencies (code, name) values
  ('CLP', 'Peso Chileno'),
  ('UF', 'Unidad de Fomento')
on conflict (code) do nothing;

insert into public.countries (code, name) values
  ('CL', 'Chile')
on conflict (code) do nothing;

insert into public.payment_methods (code, name) values
  ('transferencia', 'Transferencia Bancaria'),
  ('cheque', 'Cheque')
on conflict (code) do nothing;

insert into public.document_types (code, name, applies_to) values
  ('rut', 'RUT', array['insured','provider','company']),
  ('passport', 'Pasaporte', array['insured'])
on conflict (code) do nothing;

insert into public.liquidation_statuses (code, name, is_final) values
  ('pendiente', 'Pendiente', false),
  ('aceptada', 'Aceptada', false),
  ('pagada', 'Pagada', true)
on conflict (code) do nothing;

insert into public.pending_reasons (code, name) values
  ('antecedentes', 'Faltan antecedentes'),
  ('documentos', 'Faltan documentos')
on conflict (code) do nothing;

-- =====================================
-- 3. Extension de companies
-- =====================================

alter table public.companies
  add column if not exists country_id             uuid references public.countries(id) on delete set null,
  add column if not exists abbreviation           text,
  add column if not exists payment_days           integer default 0,
  add column if not exists delivery_days_out      integer default 0,
  add column if not exists delivery_days_in       integer default 0,
  add column if not exists cutoff_time            text default '23:59',
  add column if not exists claim_number_length    integer default 10,
  add column if not exists currency_id            uuid references public.currencies(id) on delete set null,
  add column if not exists high_amount_company    numeric(12,2) default 0,
  add column if not exists high_amount_int        numeric(12,2) default 0,
  add column if not exists waiting_type           text default 'Por Beneficiario',
  add column if not exists copy_type              text default 'No copia',
  add column if not exists treatment_type         text,
  add column if not exists commercial_payment     boolean not null default false,
  add column if not exists free_disposition_fund  boolean not null default false,
  add column if not exists reliquidation          boolean not null default false,
  add column if not exists fasec                  boolean not null default false,
  add column if not exists single_experience      boolean not null default false,
  add column if not exists single_window          boolean not null default false,
  add column if not exists auto_assign            boolean not null default false,
  add column if not exists operational_docs       boolean not null default false,
  add column if not exists paper_voucher          boolean not null default false,
  add column if not exists out_of_term            boolean not null default false,
  add column if not exists bac_number             boolean not null default false,
  add column if not exists web_denunciation_notification boolean not null default false,
  add column if not exists diagnosis_type         text,
  add column if not exists treasury_fund          boolean not null default false,
  add column if not exists pending_management     boolean not null default false,
  add column if not exists overproduction         boolean not null default false,
  add column if not exists web_insured_block      boolean not null default false,
  add column if not exists daily_shipping         boolean not null default false,
  add column if not exists receives_invoice       boolean not null default false,
  add column if not exists api_denunciation_notification boolean not null default false,
  add column if not exists payment_method_id      uuid references public.payment_methods(id) on delete set null,
  add column if not exists bank_id                uuid references public.banks(id) on delete set null,
  add column if not exists bank_account           text,
  add column if not exists bank_account_type      text;

create index if not exists companies_country_id_idx on public.companies (country_id);
create index if not exists companies_currency_id_idx on public.companies (currency_id);

-- =====================================
-- 4. Extension de providers
-- =====================================

alter table public.providers
  add column if not exists cell_phone        text,
  add column if not exists postal_code       text,
  add column if not exists country_id        uuid references public.countries(id) on delete set null,
  add column if not exists region_id         uuid references public.regions(id) on delete set null,
  add column if not exists city              text,
  add column if not exists commune           text,
  add column if not exists single_window     boolean not null default false,
  add column if not exists imed              boolean not null default false,
  add column if not exists medipass          boolean not null default false,
  add column if not exists web_reimbursement boolean not null default false,
  add column if not exists imed_financier    boolean not null default false,
  add column if not exists specialty_id      uuid references public.specialties(id) on delete set null,
  add column if not exists isapre_id         uuid references public.isapres(id) on delete set null;

create index if not exists providers_country_id_idx on public.providers (country_id);
create index if not exists providers_specialty_id_idx on public.providers (specialty_id);

-- =====================================
-- 5. Extension de medications
-- =====================================

alter table public.medications
  add column if not exists vademecum_id    uuid references public.vademecum(id) on delete set null,
  add column if not exists laboratory_id   uuid references public.laboratories(id) on delete set null,
  add column if not exists pharmacy_id     uuid references public.pharmacies(id) on delete set null,
  add column if not exists isapre_id       uuid references public.isapres(id) on delete set null;

create index if not exists medications_vademecum_id_idx on public.medications (vademecum_id);
create index if not exists medications_laboratory_id_idx on public.medications (laboratory_id);

-- =====================================
-- 6. Mapeos de codigos por compania
-- =====================================

create table if not exists public.company_provider_codes (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies(id) on delete cascade,
  provider_id   uuid not null references public.providers(id) on delete cascade,
  code_1        text,
  code_2        text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint company_provider_codes_uniq unique (company_id, provider_id)
);

create table if not exists public.company_bank_codes (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies(id) on delete cascade,
  bank_id       uuid not null references public.banks(id) on delete cascade,
  code          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint company_bank_codes_uniq unique (company_id, bank_id)
);

create table if not exists public.company_pharmacy_codes (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies(id) on delete cascade,
  pharmacy_id   uuid not null references public.pharmacies(id) on delete cascade,
  code          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint company_pharmacy_codes_uniq unique (company_id, pharmacy_id)
);

create table if not exists public.company_isapre_codes (
  id                uuid primary key default gen_random_uuid(),
  company_id        uuid not null references public.companies(id) on delete cascade,
  isapre_id         uuid not null references public.isapres(id) on delete cascade,
  isapre_plan_id    uuid references public.isapre_plans(id) on delete set null,
  code              text not null,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid,
  constraint company_isapre_codes_uniq unique (company_id, isapre_id, isapre_plan_id)
);

create table if not exists public.company_medication_codes (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies(id) on delete cascade,
  medication_id uuid not null references public.medications(id) on delete cascade,
  code          text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint company_medication_codes_uniq unique (company_id, medication_id)
);

-- Indices

create index if not exists company_provider_codes_company_id_idx    on public.company_provider_codes (company_id);
create index if not exists company_bank_codes_company_id_idx        on public.company_bank_codes (company_id);
create index if not exists company_pharmacy_codes_company_id_idx    on public.company_pharmacy_codes (company_id);
create index if not exists company_isapre_codes_company_id_idx      on public.company_isapre_codes (company_id);
create index if not exists company_medication_codes_company_id_idx  on public.company_medication_codes (company_id);

-- =====================================
-- 7. Triggers de auditoria para nuevas tablas
-- =====================================

do $$
declare
  tables text[] := array[
    'countries', 'regions', 'currencies', 'banks', 'laboratories', 'pharmacies',
    'isapres', 'isapre_plans', 'vademecum', 'document_types', 'payment_methods',
    'specialties', 'parent_relationships', 'liquidation_statuses', 'pending_reasons',
    'dispatch_campaigns', 'company_provider_codes', 'company_bank_codes',
    'company_pharmacy_codes', 'company_isapre_codes', 'company_medication_codes'
  ];
  t text;
begin
  foreach t in array tables loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%s', t, t);
    execute format('create trigger trg_%s_updated_at before update on public.%s for each row execute function public.set_updated_at()', t, t);
    execute format('drop trigger if exists trg_%s_audit_user on public.%s', t, t);
    execute format('create trigger trg_%s_audit_user before insert or update on public.%s for each row execute function public.set_audit_user()', t, t);
  end loop;
end $$;

-- =====================================
-- 8. RLS para nuevas tablas
-- =====================================

do $$
declare
  tables text[] := array[
    'countries', 'regions', 'currencies', 'banks', 'laboratories', 'pharmacies',
    'isapres', 'isapre_plans', 'vademecum', 'document_types', 'payment_methods',
    'specialties', 'parent_relationships', 'liquidation_statuses', 'pending_reasons',
    'dispatch_campaigns', 'company_provider_codes', 'company_bank_codes',
    'company_pharmacy_codes', 'company_isapre_codes', 'company_medication_codes'
  ];
  t text;
begin
  foreach t in array tables loop
    execute format('alter table public.%s enable row level security', t);
    execute format('drop policy if exists "%s_select_authenticated" on public.%s', t, t);
    execute format('create policy "%s_select_authenticated" on public.%s for select using (public.current_user_id() is not null)', t, t);
    execute format('drop policy if exists "%s_insert_admin" on public.%s', t, t);
    execute format('create policy "%s_insert_admin" on public.%s for insert with check (public.has_role(''admin''))', t, t);
    execute format('drop policy if exists "%s_update_admin" on public.%s', t, t);
    execute format('create policy "%s_update_admin" on public.%s for update using (public.has_role(''admin'')) with check (public.has_role(''admin''))', t, t);
    execute format('drop policy if exists "%s_delete_admin" on public.%s', t, t);
    execute format('create policy "%s_delete_admin" on public.%s for delete using (public.has_role(''admin''))', t, t);
  end loop;
end $$;
