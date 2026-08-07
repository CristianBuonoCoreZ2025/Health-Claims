-- Fase 5: Rectificacion de campos extendidos en insureds.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'beneficiary_rut'
  ) then
    alter table public.insureds add column beneficiary_rut text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'document_type'
  ) then
    alter table public.insureds add column document_type text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'document_number'
  ) then
    alter table public.insureds add column document_number text;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'gender' and data_type = 'USER-DEFINED'
  ) then
    alter table public.insureds
      alter column gender type text
      using case
        when gender = 'masculino' then 'M'
        when gender = 'femenino' then 'F'
        else 'Otro'
      end;
  elsif not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'gender'
  ) then
    alter table public.insureds add column gender text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'nationality'
  ) then
    alter table public.insureds add column nationality text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'country_id'
  ) then
    alter table public.insureds add column country_id uuid references public.countries(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'region_id'
  ) then
    alter table public.insureds add column region_id uuid references public.regions(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'city_id'
  ) then
    alter table public.insureds add column city_id uuid;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'commune_id'
  ) then
    alter table public.insureds add column commune_id uuid;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'postal_code'
  ) then
    alter table public.insureds add column postal_code text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'cell_phone'
  ) then
    alter table public.insureds add column cell_phone text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'marital_status'
  ) then
    alter table public.insureds add column marital_status text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'insureds' and column_name = 'occupation'
  ) then
    alter table public.insureds add column occupation text;
  end if;
end $$;

create index if not exists insureds_country_id_idx on public.insureds (country_id);
create index if not exists insureds_region_id_idx on public.insureds (region_id);
