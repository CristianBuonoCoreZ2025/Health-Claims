-- RPC calculate_claim: calcula el reembolso final aplicando topes,
-- deducibles y copagos segun las condiciones particulares de la poliza.
--
-- Parametros:
--   p_policy_id        uuid de la poliza
--   p_amount_requested monto solicitado
--   p_coverage_type_id uuid del tipo de cobertura (opcional, default NULL)
--
-- Retorna tabla con:
--   final_reimbursement, deductible_applied, copayment_applied,
--   event_limit, yearly_limit, deductible_percentage, copayment_percentage,
--   waiting_period_days, applicable (boolean)

create or replace function public.calculate_claim(
  p_policy_id        uuid,
  p_amount_requested numeric(12, 2),
  p_coverage_type_id uuid default null
)
returns table (
  final_reimbursement   numeric(12, 2),
  deductible_applied    numeric(12, 2),
  copayment_applied     numeric(12, 2),
  event_limit           numeric(12, 2),
  yearly_limit          numeric(12, 2),
  deductible_percentage numeric(5, 2),
  copayment_percentage  numeric(5, 2),
  waiting_period_days   integer,
  applicable            boolean
)
language plpgsql
security definer
as $$
declare
  v_condition record;
  v_deductible numeric(12, 2);
  v_copayment  numeric(12, 2);
  v_reimbursement numeric(12, 2);
  v_capped_amount numeric(12, 2);
begin
  -- Buscar la condicion particular aplicable.
  select pc.event_limit, pc.yearly_limit, pc.deductible_percentage,
         pc.copayment_percentage, pc.waiting_period_days
  into v_condition
  from public.policy_conditions pc
  where pc.policy_id = p_policy_id
    and pc.is_active = true
    and (p_coverage_type_id is null or pc.coverage_type_id = p_coverage_type_id)
  order by pc.created_at desc
  limit 1;

  -- Si no hay condicion configurada, reembolso total sin deducible/copago.
  if not found then
    return query select
      p_amount_requested as final_reimbursement,
      0::numeric(12, 2) as deductible_applied,
      0::numeric(12, 2) as copayment_applied,
      0::numeric(12, 2) as event_limit,
      0::numeric(12, 2) as yearly_limit,
      0::numeric(5, 2) as deductible_percentage,
      0::numeric(5, 2) as copayment_percentage,
      0 as waiting_period_days,
      false as applicable;
    return;
  end if;

  -- 1. Aplicar tope por evento.
  v_capped_amount := least(p_amount_requested, v_condition.event_limit);

  -- 2. Aplicar deducible (porcentaje sobre el monto tope).
  v_deductible := v_capped_amount * (v_condition.deductible_percentage / 100.0);

  -- 3. Monto despues de deducible.
  v_capped_amount := v_capped_amount - v_deductible;

  -- 4. Aplicar copago (porcentaje sobre el restante).
  v_copayment := v_capped_amount * (v_condition.copayment_percentage / 100.0);

  -- 5. Reembolso final = monto - deducible - copago.
  v_reimbursement := v_capped_amount - v_copayment;

  -- Asegurar no negativo.
  if v_reimbursement < 0 then
    v_reimbursement := 0;
  end if;

  return query select
    v_reimbursement as final_reimbursement,
    v_deductible as deductible_applied,
    v_copayment as copayment_applied,
    v_condition.event_limit as event_limit,
    v_condition.yearly_limit as yearly_limit,
    v_condition.deductible_percentage as deductible_percentage,
    v_condition.copayment_percentage as copayment_percentage,
    v_condition.waiting_period_days as waiting_period_days,
    true as applicable;
end;
$$;

-- Funcion de auto-asignacion: selecciona el liquidador con menos carga.
-- La carga se calcula como el numero de siniestros activos asignados
-- ponderado por los pesos definidos en liquidator_weights.
--
-- Retorna el user_id del liquidador seleccionado.

create or replace function public.assign_liquidator(
  p_coverage_type_id uuid default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_liquidator_id uuid;
begin
  -- Seleccionar el liquidador (rol 'liquidador') con menos siniestros
  -- activos asignados. Si hay coverage_type, priorizar por peso.
  with liquidadores as (
    select p.id as user_id
    from public.profiles p
    where p.role = 'liquidador' and p.is_active = true
  ),
  carga as (
    select
      l.user_id,
      count(c.id) as active_claims
    from liquidadores l
    left join public.claims c
      on c.assigned_liquidator_id = l.user_id
      and c.status in ('asignado', 'en_revision', 'solicitando_antecedentes')
    group by l.user_id
  )
  select c.user_id
  into v_liquidator_id
  from carga c
  order by c.active_claims asc, c.user_id
  limit 1;

  return v_liquidator_id;
end;
$$;

-- Trigger: auto-asignar liquidador al crear un siniestro.
create or replace function public.auto_assign_liquidator()
returns trigger as $$
declare
  v_liquidator_id uuid;
begin
  -- Solo asignar si no tiene liquidador y esta en estado 'ingresado'.
  if new.assigned_liquidator_id is null and new.status = 'ingresado' then
    v_liquidator_id := public.assign_liquidator();
    if v_liquidator_id is not null then
      new.assigned_liquidator_id := v_liquidator_id;
      new.status := 'asignado';

      -- Insertar entrada en timeline.
      insert into public.claim_timeline (claim_id, action_type, description, created_by)
      values (new.id, 'asignado', 'Siniestro asignado automaticamente', new.created_by);
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Nota: el trigger de asignacion se ejecuta BEFORE INSERT, despues del
-- trigger de generacion de numero. El orden importa.
drop trigger if exists trg_claims_auto_assign on public.claims;
create trigger trg_claims_auto_assign
  before insert on public.claims
  for each row execute function public.auto_assign_liquidator();

-- Funcion convenience para cambiar estado del siniestro + timeline.
create or replace function public.update_claim_status(
  p_claim_id    uuid,
  p_new_status  public.claim_status,
  p_description text default null
)
returns void
language plpgsql
security definer
as $$
declare
  v_old_status public.claim_status;
  v_action public.claim_action_type;
begin
  select status into v_old_status from public.claims where id = p_claim_id;
  if not found then
    raise exception 'Siniestro no encontrado';
  end if;

  -- Mapear estado a tipo de accion timeline.
  v_action := case p_new_status
    when 'en_revision' then 'en_revision'::public.claim_action_type
    when 'solicitando_antecedentes' then 'antecedentes_solicitados'::public.claim_action_type
    when 'aprobado' then 'aprobado'::public.claim_action_type
    when 'rechazado' then 'rechazado'::public.claim_action_type
    when 'pagado' then 'pagado'::public.claim_action_type
    else 'comentario'::public.claim_action_type
  end;

  update public.claims
  set status = p_new_status, updated_at = now()
  where id = p_claim_id;

  insert into public.claim_timeline (claim_id, action_type, description, created_by)
  values (p_claim_id, v_action, coalesce(p_description, 'Estado actualizado a: ' || p_new_status::text), auth.uid());
end;
$$;
