-- Tabla claim_details (detalle de prestaciones de un siniestro).
-- Cada linea tiene provider, diagnostico, medicamento opcional,
-- monto, deducible aplicado, copago aplicado y reembolso final.

create table if not exists public.claim_details (
  id                    uuid primary key default gen_random_uuid(),
  claim_id              uuid not null references public.claims(id) on delete cascade,
  provider_id           uuid references public.providers(id) on delete restrict,
  diagnostic_id         uuid references public.diagnostics(id) on delete restrict,
  medication_id         uuid references public.medications(id) on delete set null,
  coverage_type_id      uuid references public.coverage_types(id) on delete restrict,
  service_date          date not null,
  amount                numeric(12, 2) not null default 0,
  deductible_applied    numeric(12, 2) not null default 0,
  copayment_applied     numeric(12, 2) not null default 0,
  final_reimbursement   numeric(12, 2) not null default 0,
  observation           text,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid,
  updated_by            uuid,
  constraint claim_details_amount_chk check (amount >= 0),
  constraint claim_details_deductible_chk check (deductible_applied >= 0),
  constraint claim_details_copayment_chk check (copayment_applied >= 0),
  constraint claim_details_reimbursement_chk check (final_reimbursement >= 0)
);

create index if not exists claim_details_claim_id_idx      on public.claim_details (claim_id);
create index if not exists claim_details_provider_id_idx   on public.claim_details (provider_id);
create index if not exists claim_details_diagnostic_id_idx on public.claim_details (diagnostic_id);

drop trigger if exists trg_claim_details_updated_at on public.claim_details;
create trigger trg_claim_details_updated_at
  before update on public.claim_details
  for each row execute function public.set_updated_at();

drop trigger if exists trg_claim_details_audit_user on public.claim_details;
create trigger trg_claim_details_audit_user
  before insert or update on public.claim_details
  for each row execute function public.set_audit_user();

alter table public.claim_details enable row level security;

drop policy if exists "claim_details_select_authenticated" on public.claim_details;
create policy "claim_details_select_authenticated"
  on public.claim_details for select
  using (public.current_user_id() is not null);

drop policy if exists "claim_details_insert_liquidator_admin" on public.claim_details;
create policy "claim_details_insert_liquidator_admin"
  on public.claim_details for insert
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidador')
  );

drop policy if exists "claim_details_update_liquidator_admin" on public.claim_details;
create policy "claim_details_update_liquidator_admin"
  on public.claim_details for update
  using (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidador')
  )
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidador')
  );

drop policy if exists "claim_details_delete_admin" on public.claim_details;
create policy "claim_details_delete_admin"
  on public.claim_details for delete
  using (public.has_role('admin'));
