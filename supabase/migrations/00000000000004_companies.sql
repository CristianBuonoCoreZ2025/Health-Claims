-- Tabla companies (companias aseguradoras / holdings).
-- holding_id es auto-referencial para modelar grupos/holdings.

create table if not exists public.companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  rut         text not null,
  address     text,
  phone       text,
  email       text,
  holding_id  uuid references public.companies(id) on delete set null,
  logo_url    text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint companies_name_chk check (length(trim(name)) > 0),
  constraint companies_rut_chk  check (length(trim(rut)) > 0),
  constraint companies_email_chk check (email is null or email ~* '^[^@]+@[^@]+\.[^@]+$')
);

create index if not exists companies_name_idx      on public.companies (name);
create index if not exists companies_rut_idx       on public.companies (rut);
create index if not exists companies_holding_id_idx on public.companies (holding_id);
create index if not exists companies_is_active_idx on public.companies (is_active);

drop trigger if exists trg_companies_updated_at on public.companies;
create trigger trg_companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

drop trigger if exists trg_companies_audit_user on public.companies;
create trigger trg_companies_audit_user
  before insert or update on public.companies
  for each row execute function public.set_audit_user();

alter table public.companies enable row level security;

-- Lectura para cualquier usuario autenticado.
drop policy if exists "companies_select_authenticated" on public.companies;
create policy "companies_select_authenticated"
  on public.companies for select
  using (public.current_user_id() is not null);

-- Escritura solo para admin.
drop policy if exists "companies_insert_admin" on public.companies;
create policy "companies_insert_admin"
  on public.companies for insert
  with check (public.has_role('admin'));

drop policy if exists "companies_update_admin" on public.companies;
create policy "companies_update_admin"
  on public.companies for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "companies_delete_admin" on public.companies;
create policy "companies_delete_admin"
  on public.companies for delete
  using (public.has_role('admin'));
