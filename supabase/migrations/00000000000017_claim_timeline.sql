-- Tabla claim_timeline (historial de acciones de un siniestro).

do $$ begin
  create type public.claim_action_type as enum (
    'creado',
    'asignado',
    'en_revision',
    'antecedentes_solicitados',
    'aprobado',
    'rechazado',
    'pagado',
    'comentario',
    'documento_agregado'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.claim_timeline (
  id          uuid primary key default gen_random_uuid(),
  claim_id    uuid not null references public.claims(id) on delete cascade,
  action_type public.claim_action_type not null,
  description text,
  created_by  uuid,
  created_at  timestamptz not null default now()
);

create index if not exists claim_timeline_claim_id_idx on public.claim_timeline (claim_id);
create index if not exists claim_timeline_created_at_idx on public.claim_timeline (created_at);

-- Trigger: insertar entrada 'creado' al crear un siniestro.
create or replace function public.claim_created_timeline()
returns trigger as $$
begin
  insert into public.claim_timeline (claim_id, action_type, description, created_by)
  values (new.id, 'creado', 'Siniestro ingresado', new.created_by);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_claims_created_timeline on public.claims;
create trigger trg_claims_created_timeline
  after insert on public.claims
  for each row execute function public.claim_created_timeline();

alter table public.claim_timeline enable row level security;

drop policy if exists "claim_timeline_select_authenticated" on public.claim_timeline;
create policy "claim_timeline_select_authenticated"
  on public.claim_timeline for select
  using (public.current_user_id() is not null);

drop policy if exists "claim_timeline_insert_authenticated" on public.claim_timeline;
create policy "claim_timeline_insert_authenticated"
  on public.claim_timeline for insert
  with check (public.current_user_id() is not null);

drop policy if exists "claim_timeline_delete_admin" on public.claim_timeline;
create policy "claim_timeline_delete_admin"
  on public.claim_timeline for delete
  using (public.has_role('admin'));
