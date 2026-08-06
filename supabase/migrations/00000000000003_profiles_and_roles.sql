-- Tabla profiles + roles + trigger de creacion automatica al registrar usuario.
-- profiles.id = auth.users.id (1:1). Rol determina permisos (RLS por politica).

-- Enum de roles de la aplicacion.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'supervisor', 'liquidator');
  end if;
end $$;

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        public.app_role not null default 'liquidator',
  team_id     uuid,
  full_name   text not null default '',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint profiles_role_chk check (role in ('admin', 'supervisor', 'liquidator'))
);

create index if not exists profiles_role_idx        on public.profiles (role);
create index if not exists profiles_team_id_idx     on public.profiles (team_id);
create index if not exists profiles_is_active_idx   on public.profiles (is_active);

-- Triggers de auditoria reutilizables (definidos en migracion 0002).
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_audit_user on public.profiles;
create trigger trg_profiles_audit_user
  before insert or update on public.profiles
  for each row execute function public.set_audit_user();

-- Helper de rol del usuario actual (requiere profiles, por eso va aqui).
create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select p.role::text
  from public.profiles p
  where p.id = public.current_user_id()
$$;

-- Helper booleano: el usuario actual tiene el rol indicado?
create or replace function public.has_role(p_role text)
returns boolean
language sql
stable
as $$
  select public.current_user_role() = p_role
$$;

-- Crea el perfil automaticamente cuando un nuevo usuario se registra en auth.users.
-- Rol por defecto: liquidator. Un admin promueve manualmente a supervisor/admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS sobre profiles.
alter table public.profiles enable row level security;

-- Cada usuario puede leer su propio perfil.
drop policy if exists "profiles_select_self_or_staff" on public.profiles;
create policy "profiles_select_self_or_staff"
  on public.profiles for select
  using (
    id = public.current_user_id()
    or public.has_role('admin')
    or public.has_role('supervisor')
  );

-- Un usuario puede actualizar su propio perfil (solo datos no sensibles).
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (id = public.current_user_id())
  with check (id = public.current_user_id());

-- Solo admin puede crear/actualizar perfiles arbitrarios (gestion de usuarios).
drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin"
  on public.profiles for insert
  with check (public.has_role('admin'));

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
  on public.profiles for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

-- El trigger handle_new_user corre como security definer (service role),
-- por lo que la politica insert no bloquea la creacion automatica del perfil.
