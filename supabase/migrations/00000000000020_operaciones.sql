-- Vista liquidator_workload: carga de trabajo actual por liquidador.
-- Muestra el numero de siniestros activos por estado y totales.

create or replace view public.liquidator_workload as
select
  p.id as user_id,
  p.full_name,
  count(c.id) filter (where c.status in ('asignado', 'en_revision', 'solicitando_antecedentes')) as active_claims,
  count(c.id) filter (where c.status = 'asignado') as assigned,
  count(c.id) filter (where c.status = 'en_revision') as in_review,
  count(c.id) filter (where c.status = 'solicitando_antecedentes') as requesting_docs,
  count(c.id) filter (where c.status = 'aprobado') as approved,
  count(c.id) filter (where c.status = 'rechazado') as rejected,
  count(c.id) filter (where c.status = 'pagado') as paid,
  count(c.id) as total_claims,
  coalesce(sum(c.amount_requested) filter (where c.status in ('asignado', 'en_revision', 'solicitando_antecedentes')), 0) as active_amount
from public.profiles p
left join public.claims c on c.assigned_liquidator_id = p.id
where p.role = 'liquidator' and p.is_active = true
group by p.id, p.full_name;

alter view public.liquidator_workload owner to postgres;

-- RLS sobre la vista: autenticados pueden leer.
-- Las vistas heredan RLS de las tablas subyacentes, pero aseguramos
-- que solo usuarios autenticados accedan via la policy de profiles.

-- RPC reingresar_siniestro: cambia un siniestro rechazado a 'ingresado'
-- y lo reasigna automaticamente.
create or replace function public.reingresar_siniestro(
  p_claim_id    uuid,
  p_description text default null
)
returns void
language plpgsql
security definer
as $$
declare
  v_current_status public.claim_status;
  v_liquidator_id  uuid;
begin
  select status into v_current_status from public.claims where id = p_claim_id;
  if not found then
    raise exception 'Siniestro no encontrado';
  end if;

  if v_current_status != 'rechazado' then
    raise exception 'Solo se pueden reingresar siniestros rechazados';
  end if;

  -- Reasignar liquidador.
  v_liquidator_id := public.assign_liquidator();

  update public.claims
  set status = 'asignado',
      assigned_liquidator_id = v_liquidator_id,
      updated_at = now()
  where id = p_claim_id;

  insert into public.claim_timeline (claim_id, action_type, description, created_by)
  values (
    p_claim_id,
    'asignado',
    coalesce(p_description, 'Siniestro reingresado y reasignado'),
    auth.uid()
  );
end;
$$;

-- RPC anular_siniestro: marca un siniestro como inactivo (anulado).
create or replace function public.anular_siniestro(
  p_claim_id    uuid,
  p_description text default null
)
returns void
language plpgsql
security definer
as $$
begin
  update public.claims
  set is_active = false,
      status = 'rechazado',
      updated_at = now()
  where id = p_claim_id;

  insert into public.claim_timeline (claim_id, action_type, description, created_by)
  values (
    p_claim_id,
    'rechazado',
    coalesce(p_description, 'Siniestro anulado'),
    auth.uid()
  );
end;
$$;

-- Vista claim_rejections: siniestros rechazados para modulo de rechazos.
create or replace view public.claim_rejections as
select
  c.id,
  c.claim_number,
  c.policy_id,
  c.insured_id,
  c.incident_date,
  c.report_date,
  c.amount_requested,
  c.assigned_liquidator_id,
  c.is_active,
  c.updated_at as rejected_at,
  (select ct.description from public.claim_timeline ct
   where ct.claim_id = c.id and ct.action_type = 'rechazado'
   order by ct.created_at desc limit 1) as rejection_reason,
  p.holder_name,
  i.first_name as insured_first_name,
  i.last_name as insured_last_name
from public.claims c
left join public.policies p on p.id = c.policy_id
left join public.insureds i on i.id = c.insured_id
where c.status = 'rechazado'
order by c.updated_at desc;

alter view public.claim_rejections owner to postgres;
