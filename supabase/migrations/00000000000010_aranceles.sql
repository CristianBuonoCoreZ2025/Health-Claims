-- Tabla aranceles (arancel de prestaciones de salud, jerarquia 3 niveles).
-- Nivel 1: categoria raiz (ej: Hospitalizacion).
-- Nivel 2: subcategoria (ej: Cirugia).
-- Nivel 3: prestacion final con monto (ej: Apendicitis).
-- parent_id auto-referencial modela el arbol.

create table if not exists public.aranceles (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references public.aranceles(id) on delete cascade,
  code        text not null,
  name        text not null,
  description text,
  level       smallint not null default 1,
  amount      numeric(12, 2) not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid,
  updated_by  uuid,
  constraint aranceles_level_chk check (level in (1, 2, 3)),
  constraint aranceles_code_chk check (length(trim(code)) > 0),
  constraint aranceles_name_chk check (length(trim(name)) > 0),
  constraint aranceles_amount_chk check (amount >= 0)
);

create index if not exists aranceles_parent_id_idx on public.aranceles (parent_id);
create index if not exists aranceles_level_idx     on public.aranceles (level);
create index if not exists aranceles_code_idx      on public.aranceles (code);
create index if not exists aranceles_name_trgm_idx on public.aranceles using gin (name gin_trgm_ops);
create index if not exists aranceles_is_active_idx on public.aranceles (is_active);

drop trigger if exists trg_aranceles_updated_at on public.aranceles;
create trigger trg_aranceles_updated_at
  before update on public.aranceles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_aranceles_audit_user on public.aranceles;
create trigger trg_aranceles_audit_user
  before insert or update on public.aranceles
  for each row execute function public.set_audit_user();

alter table public.aranceles enable row level security;

drop policy if exists "aranceles_select_authenticated" on public.aranceles;
create policy "aranceles_select_authenticated"
  on public.aranceles for select
  using (public.current_user_id() is not null);

drop policy if exists "aranceles_insert_admin" on public.aranceles;
create policy "aranceles_insert_admin"
  on public.aranceles for insert
  with check (public.has_role('admin'));

drop policy if exists "aranceles_update_admin" on public.aranceles;
create policy "aranceles_update_admin"
  on public.aranceles for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "aranceles_delete_admin" on public.aranceles;
create policy "aranceles_delete_admin"
  on public.aranceles for delete
  using (public.has_role('admin'));
