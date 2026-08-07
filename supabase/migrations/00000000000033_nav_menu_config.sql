create table if not exists public.nav_menu_config (
  id          int primary key default 1,
  config      jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  constraint nav_menu_config_singleton check (id = 1)
);

alter table public.nav_menu_config enable row level security;

drop policy if exists "nav_menu_config_select_authenticated" on public.nav_menu_config;
create policy "nav_menu_config_select_authenticated"
  on public.nav_menu_config for select
  using (public.current_user_id() is not null);

drop policy if exists "nav_menu_config_upsert_admin" on public.nav_menu_config;
create policy "nav_menu_config_upsert_admin"
  on public.nav_menu_config for insert
  with check (public.has_role('admin'));

drop policy if exists "nav_menu_config_update_admin" on public.nav_menu_config;
create policy "nav_menu_config_update_admin"
  on public.nav_menu_config for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));
