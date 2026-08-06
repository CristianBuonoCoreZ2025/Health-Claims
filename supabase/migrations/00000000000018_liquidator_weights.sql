-- Tabla liquidator_weights (peso de carga por cobertura para asignacion).
-- Permite calcular que liquidador tiene menos carga para asignar siniestros.

create table if not exists public.liquidator_weights (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null,
  coverage_type_id  uuid references public.coverage_types(id) on delete cascade,
  level             text not null default 'general',
  weight_value      numeric(5, 2) not null default 1.0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid,
  constraint liquidator_weights_uniq unique (user_id, coverage_type_id, level),
  constraint liquidator_weight_chk check (weight_value >= 0)
);

create index if not exists liquidator_weights_user_id_idx on public.liquidator_weights (user_id);
create index if not exists liquidator_weights_coverage_idx on public.liquidator_weights (coverage_type_id);

drop trigger if exists trg_liquidator_weights_updated_at on public.liquidator_weights;
create trigger trg_liquidator_weights_updated_at
  before update on public.liquidator_weights
  for each row execute function public.set_updated_at();

drop trigger if exists trg_liquidator_weights_audit_user on public.liquidator_weights;
create trigger trg_liquidator_weights_audit_user
  before insert or update on public.liquidator_weights
  for each row execute function public.set_audit_user();

alter table public.liquidator_weights enable row level security;

drop policy if exists "liquidator_weights_select_authenticated" on public.liquidator_weights;
create policy "liquidator_weights_select_authenticated"
  on public.liquidator_weights for select
  using (public.current_user_id() is not null);

drop policy if exists "liquidator_weights_insert_admin" on public.liquidator_weights;
create policy "liquidator_weights_insert_admin"
  on public.liquidator_weights for insert
  with check (public.has_role('admin'));

drop policy if exists "liquidator_weights_update_admin" on public.liquidator_weights;
create policy "liquidator_weights_update_admin"
  on public.liquidator_weights for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "liquidator_weights_delete_admin" on public.liquidator_weights;
create policy "liquidator_weights_delete_admin"
  on public.liquidator_weights for delete
  using (public.has_role('admin'));
