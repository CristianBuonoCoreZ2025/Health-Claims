-- Tabla claims (siniestros / liquidaciones).
-- Enum de estado de siniestro.

do $$ begin
  create type public.claim_status as enum (
    'ingresado',
    'asignado',
    'en_revision',
    'solicitando_antecedentes',
    'aprobado',
    'rechazado',
    'pagado'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.claims (
  id                    uuid primary key default gen_random_uuid(),
  policy_id             uuid not null references public.policies(id) on delete restrict,
  insured_id            uuid not null references public.insureds(id) on delete restrict,
  claim_number          text not null,
  incident_date         date not null,
  report_date           date not null default current_date,
  status                public.claim_status not null default 'ingresado',
  description           text,
  amount_requested      numeric(12, 2) not null default 0,
  final_reimbursement   numeric(12, 2),
  assigned_liquidator_id uuid,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid,
  updated_by            uuid,
  constraint claims_number_chk check (length(trim(claim_number)) > 0),
  constraint claims_amount_chk check (amount_requested >= 0),
  constraint claims_reimbursement_chk check (final_reimbursement is null or final_reimbursement >= 0)
);

create index if not exists claims_policy_id_idx        on public.claims (policy_id);
create index if not exists claims_insured_id_idx       on public.claims (insured_id);
create index if not exists claims_claim_number_idx     on public.claims (claim_number);
create index if not exists claims_status_idx           on public.claims (status);
create index if not exists claims_liquidator_id_idx    on public.claims (assigned_liquidator_id);
create index if not exists claims_report_date_idx      on public.claims (report_date);
create index if not exists claims_is_active_idx        on public.claims (is_active);

-- Secuencia para generar numeros de siniestro automaticos.
create sequence if not exists public.claim_number_seq start 1;

drop trigger if exists trg_claims_updated_at on public.claims;
create trigger trg_claims_updated_at
  before update on public.claims
  for each row execute function public.set_updated_at();

drop trigger if exists trg_claims_audit_user on public.claims;
create trigger trg_claims_audit_user
  before insert or update on public.claims
  for each row execute function public.set_audit_user();

-- Trigger: generar claim_number automatico al insertar.
create or replace function public.generate_claim_number()
returns trigger as $$
begin
  if new.claim_number is null or new.claim_number = '' then
    new.claim_number := 'SIN-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.claim_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_claims_generate_number on public.claims;
create trigger trg_claims_generate_number
  before insert on public.claims
  for each row execute function public.generate_claim_number();

alter table public.claims enable row level security;

drop policy if exists "claims_select_authenticated" on public.claims;
create policy "claims_select_authenticated"
  on public.claims for select
  using (public.current_user_id() is not null);

drop policy if exists "claims_insert_authenticated" on public.claims;
create policy "claims_insert_authenticated"
  on public.claims for insert
  with check (public.current_user_id() is not null);

drop policy if exists "claims_update_liquidator_admin" on public.claims;
create policy "claims_update_liquidator_admin"
  on public.claims for update
  using (
    public.has_role('admin')
    or public.has_role('supervisor')
    or assigned_liquidator_id = public.current_user_id()
  )
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or assigned_liquidator_id = public.current_user_id()
  );

drop policy if exists "claims_delete_admin" on public.claims;
create policy "claims_delete_admin"
  on public.claims for delete
  using (public.has_role('admin'));
