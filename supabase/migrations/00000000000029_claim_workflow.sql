-- Fase 6: Nuevas tablas de workflow y rectificacion de claim_details/claim_timeline.

-- Rectificacion de claim_details
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'service_group_id'
  ) then
    alter table public.claim_details add column service_group_id uuid references public.service_groups(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'service_subgroup_id'
  ) then
    alter table public.claim_details add column service_subgroup_id uuid references public.service_subgroups(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'service_item_id'
  ) then
    alter table public.claim_details add column service_item_id uuid references public.service_items(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'company_code'
  ) then
    alter table public.claim_details add column company_code text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'pharmacy_id'
  ) then
    alter table public.claim_details add column pharmacy_id uuid references public.pharmacies(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'imed_amount'
  ) then
    alter table public.claim_details add column imed_amount numeric(12, 2) not null default 0;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'medipass_amount'
  ) then
    alter table public.claim_details add column medipass_amount numeric(12, 2) not null default 0;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'web_reimbursement_amount'
  ) then
    alter table public.claim_details add column web_reimbursement_amount numeric(12, 2) not null default 0;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'financier_amount'
  ) then
    alter table public.claim_details add column financier_amount numeric(12, 2) not null default 0;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'excess_amount'
  ) then
    alter table public.claim_details add column excess_amount numeric(12, 2) not null default 0;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_details' and column_name = 'pharmacy_limit_applied'
  ) then
    alter table public.claim_details add column pharmacy_limit_applied boolean not null default false;
  end if;
end $$;

create index if not exists claim_details_service_group_idx on public.claim_details (service_group_id);
create index if not exists claim_details_service_subgroup_idx on public.claim_details (service_subgroup_id);
create index if not exists claim_details_service_item_idx on public.claim_details (service_item_id);
create index if not exists claim_details_pharmacy_idx on public.claim_details (pharmacy_id);

-- Rectificacion de claim_timeline
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_timeline' and column_name = 'stage'
  ) then
    alter table public.claim_timeline add column stage text;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_name = 'claim_timeline' and column_name = 'action_type' and data_type = 'USER-DEFINED'
  ) then
    alter table public.claim_timeline
      alter column action_type type text
      using action_type::text;
  elsif not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_timeline' and column_name = 'action_type'
  ) then
    alter table public.claim_timeline add column action_type text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_timeline' and column_name = 'sla_minutes'
  ) then
    alter table public.claim_timeline add column sla_minutes integer;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_timeline' and column_name = 'updated_at'
  ) then
    alter table public.claim_timeline add column updated_at timestamptz not null default now();
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claim_timeline' and column_name = 'updated_by'
  ) then
    alter table public.claim_timeline add column updated_by uuid;
  end if;
end $$;

drop trigger if exists trg_claim_timeline_updated_at on public.claim_timeline;
create trigger trg_claim_timeline_updated_at
  before update on public.claim_timeline
  for each row execute function public.set_updated_at();

drop trigger if exists trg_claim_timeline_audit_user on public.claim_timeline;
create trigger trg_claim_timeline_audit_user
  before insert or update on public.claim_timeline
  for each row execute function public.set_audit_user();

-- claim_forms
create table if not exists public.claim_forms (
  id            uuid primary key default gen_random_uuid(),
  claim_id      uuid not null references public.claims(id) on delete cascade,
  form_number   text,
  received_by   text,
  received_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

create index if not exists claim_forms_claim_id_idx on public.claim_forms (claim_id);

drop trigger if exists trg_claim_forms_updated_at on public.claim_forms;
create trigger trg_claim_forms_updated_at
  before update on public.claim_forms
  for each row execute function public.set_updated_at();

drop trigger if exists trg_claim_forms_audit_user on public.claim_forms;
create trigger trg_claim_forms_audit_user
  before insert or update on public.claim_forms
  for each row execute function public.set_audit_user();

alter table public.claim_forms enable row level security;

drop policy if exists "claim_forms_select_authenticated" on public.claim_forms;
create policy "claim_forms_select_authenticated"
  on public.claim_forms for select
  using (public.current_user_id() is not null);

drop policy if exists "claim_forms_insert_liquidator_admin" on public.claim_forms;
create policy "claim_forms_insert_liquidator_admin"
  on public.claim_forms for insert
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidador')
  );

drop policy if exists "claim_forms_update_liquidator_admin" on public.claim_forms;
create policy "claim_forms_update_liquidator_admin"
  on public.claim_forms for update
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

drop policy if exists "claim_forms_delete_admin" on public.claim_forms;
create policy "claim_forms_delete_admin"
  on public.claim_forms for delete
  using (public.has_role('admin'));

-- claim_receipts
create table if not exists public.claim_receipts (
  id                uuid primary key default gen_random_uuid(),
  claim_id          uuid not null references public.claims(id) on delete cascade,
  document_type_id  uuid references public.document_types(id) on delete set null,
  receipt_number    text,
  received_at       timestamptz,
  verified          boolean not null default false,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists claim_receipts_claim_id_idx on public.claim_receipts (claim_id);

drop trigger if exists trg_claim_receipts_updated_at on public.claim_receipts;
create trigger trg_claim_receipts_updated_at
  before update on public.claim_receipts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_claim_receipts_audit_user on public.claim_receipts;
create trigger trg_claim_receipts_audit_user
  before insert or update on public.claim_receipts
  for each row execute function public.set_audit_user();

alter table public.claim_receipts enable row level security;

drop policy if exists "claim_receipts_select_authenticated" on public.claim_receipts;
create policy "claim_receipts_select_authenticated"
  on public.claim_receipts for select
  using (public.current_user_id() is not null);

drop policy if exists "claim_receipts_insert_liquidator_admin" on public.claim_receipts;
create policy "claim_receipts_insert_liquidator_admin"
  on public.claim_receipts for insert
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidador')
  );

drop policy if exists "claim_receipts_update_liquidator_admin" on public.claim_receipts;
create policy "claim_receipts_update_liquidator_admin"
  on public.claim_receipts for update
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

drop policy if exists "claim_receipts_delete_admin" on public.claim_receipts;
create policy "claim_receipts_delete_admin"
  on public.claim_receipts for delete
  using (public.has_role('admin'));

-- claim_dispatches
create table if not exists public.claim_dispatches (
  id                uuid primary key default gen_random_uuid(),
  claim_id          uuid not null references public.claims(id) on delete cascade,
  remittance_number text,
  dispatch_date     date,
  carrier           text,
  tracking_code     text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists claim_dispatches_claim_id_idx on public.claim_dispatches (claim_id);

drop trigger if exists trg_claim_dispatches_updated_at on public.claim_dispatches;
create trigger trg_claim_dispatches_updated_at
  before update on public.claim_dispatches
  for each row execute function public.set_updated_at();

drop trigger if exists trg_claim_dispatches_audit_user on public.claim_dispatches;
create trigger trg_claim_dispatches_audit_user
  before insert or update on public.claim_dispatches
  for each row execute function public.set_audit_user();

alter table public.claim_dispatches enable row level security;

drop policy if exists "claim_dispatches_select_authenticated" on public.claim_dispatches;
create policy "claim_dispatches_select_authenticated"
  on public.claim_dispatches for select
  using (public.current_user_id() is not null);

drop policy if exists "claim_dispatches_insert_liquidator_admin" on public.claim_dispatches;
create policy "claim_dispatches_insert_liquidator_admin"
  on public.claim_dispatches for insert
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidador')
  );

drop policy if exists "claim_dispatches_update_liquidator_admin" on public.claim_dispatches;
create policy "claim_dispatches_update_liquidator_admin"
  on public.claim_dispatches for update
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

drop policy if exists "claim_dispatches_delete_admin" on public.claim_dispatches;
create policy "claim_dispatches_delete_admin"
  on public.claim_dispatches for delete
  using (public.has_role('admin'));

-- claim_payments
create table if not exists public.claim_payments (
  id                uuid primary key default gen_random_uuid(),
  claim_id          uuid not null references public.claims(id) on delete cascade,
  amount            numeric(12, 2) not null default 0,
  payment_date      date,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  currency_id       uuid references public.currencies(id) on delete set null,
  reference         text,
  status            text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists claim_payments_claim_id_idx on public.claim_payments (claim_id);

drop trigger if exists trg_claim_payments_updated_at on public.claim_payments;
create trigger trg_claim_payments_updated_at
  before update on public.claim_payments
  for each row execute function public.set_updated_at();

drop trigger if exists trg_claim_payments_audit_user on public.claim_payments;
create trigger trg_claim_payments_audit_user
  before insert or update on public.claim_payments
  for each row execute function public.set_audit_user();

alter table public.claim_payments enable row level security;

drop policy if exists "claim_payments_select_authenticated" on public.claim_payments;
create policy "claim_payments_select_authenticated"
  on public.claim_payments for select
  using (public.current_user_id() is not null);

drop policy if exists "claim_payments_insert_liquidator_admin" on public.claim_payments;
create policy "claim_payments_insert_liquidator_admin"
  on public.claim_payments for insert
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidador')
  );

drop policy if exists "claim_payments_update_liquidator_admin" on public.claim_payments;
create policy "claim_payments_update_liquidator_admin"
  on public.claim_payments for update
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

drop policy if exists "claim_payments_delete_admin" on public.claim_payments;
create policy "claim_payments_delete_admin"
  on public.claim_payments for delete
  using (public.has_role('admin'));

-- claim_workflow_stages
create table if not exists public.claim_workflow_stages (
  id            uuid primary key default gen_random_uuid(),
  claim_id      uuid not null references public.claims(id) on delete cascade,
  stage         text,
  action_type   text,
  sla_minutes   integer,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  completed_by  uuid,
  comments      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid
);

create index if not exists claim_workflow_stages_claim_id_idx on public.claim_workflow_stages (claim_id);

drop trigger if exists trg_claim_workflow_stages_updated_at on public.claim_workflow_stages;
create trigger trg_claim_workflow_stages_updated_at
  before update on public.claim_workflow_stages
  for each row execute function public.set_updated_at();

drop trigger if exists trg_claim_workflow_stages_audit_user on public.claim_workflow_stages;
create trigger trg_claim_workflow_stages_audit_user
  before insert or update on public.claim_workflow_stages
  for each row execute function public.set_audit_user();

alter table public.claim_workflow_stages enable row level security;

drop policy if exists "claim_workflow_stages_select_authenticated" on public.claim_workflow_stages;
create policy "claim_workflow_stages_select_authenticated"
  on public.claim_workflow_stages for select
  using (public.current_user_id() is not null);

drop policy if exists "claim_workflow_stages_insert_liquidator_admin" on public.claim_workflow_stages;
create policy "claim_workflow_stages_insert_liquidator_admin"
  on public.claim_workflow_stages for insert
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidador')
  );

drop policy if exists "claim_workflow_stages_update_liquidator_admin" on public.claim_workflow_stages;
create policy "claim_workflow_stages_update_liquidator_admin"
  on public.claim_workflow_stages for update
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

drop policy if exists "claim_workflow_stages_delete_admin" on public.claim_workflow_stages;
create policy "claim_workflow_stages_delete_admin"
  on public.claim_workflow_stages for delete
  using (public.has_role('admin'));
