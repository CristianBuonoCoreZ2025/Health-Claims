-- Fase 5: Rectificacion de pre_existing_conditions.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'pre_existing_conditions' and column_name = 'term_months'
  ) then
    alter table public.pre_existing_conditions add column term_months integer;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'pre_existing_conditions' and column_name = 'amount_cap'
  ) then
    alter table public.pre_existing_conditions add column amount_cap numeric(12, 2);
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'pre_existing_conditions' and column_name = 'dictamen_code'
  ) then
    alter table public.pre_existing_conditions add column dictamen_code text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'pre_existing_conditions' and column_name = 'dictamen_text'
  ) then
    alter table public.pre_existing_conditions add column dictamen_text text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'pre_existing_conditions' and column_name = 'exclusion_date'
  ) then
    alter table public.pre_existing_conditions add column exclusion_date date;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'pre_existing_conditions' and column_name = 'excluded_until'
  ) then
    alter table public.pre_existing_conditions add column excluded_until date;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'pre_existing_conditions' and column_name = 'is_excluded'
  ) then
    alter table public.pre_existing_conditions add column is_excluded boolean not null default false;
  end if;
end $$;
