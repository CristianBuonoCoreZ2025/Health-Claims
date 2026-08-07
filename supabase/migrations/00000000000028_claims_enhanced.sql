-- Fase 6: Rectificacion de la tabla claims.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'form_number'
  ) then
    alter table public.claims add column form_number text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'receipt_date'
  ) then
    alter table public.claims add column receipt_date date;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'dispatch_date'
  ) then
    alter table public.claims add column dispatch_date date;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'payment_date'
  ) then
    alter table public.claims add column payment_date date;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'payment_amount'
  ) then
    alter table public.claims add column payment_amount numeric(12, 2);
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'remittance_number'
  ) then
    alter table public.claims add column remittance_number text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'settlement_type'
  ) then
    alter table public.claims add column settlement_type text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'company_settlement_code'
  ) then
    alter table public.claims add column company_settlement_code text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'insured_settlement_code'
  ) then
    alter table public.claims add column insured_settlement_code text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'medical_id'
  ) then
    alter table public.claims add column medical_id text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'claims' and column_name = 'beneficiary_id'
  ) then
    alter table public.claims add column beneficiary_id uuid references public.insureds(id) on delete set null;
  end if;
end $$;

create index if not exists claims_beneficiary_id_idx on public.claims (beneficiary_id);
