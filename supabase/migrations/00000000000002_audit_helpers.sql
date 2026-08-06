-- Helpers de auditoria reutilizables por todas las tablas de negocio.
-- Se definen ANTES que las tablas para que sus triggers puedan referenciarlos.

-- Devuelve el id del usuario autenticado actual (auth.uid() seguro en contexto no-auth).
create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid()
$$;

-- Trigger: actualiza updated_at en cada UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger: completa campos de auditoria (created_by en INSERT, updated_by en INSERT/UPDATE).
create or replace function public.set_audit_user()
returns trigger
language plpgsql
as $$
begin
  new.updated_by = public.current_user_id();
  if tg_op = 'INSERT' and new.created_by is null then
    new.created_by = public.current_user_id();
  end if;
  return new;
end;
$$;
