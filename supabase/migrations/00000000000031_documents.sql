-- Fase 8: Documentos y plantillas.

-- document_types ya fue creado en la Fase 1; se reafirma su uso como catalogo.

-- Documentos vinculados a entidades
 create table if not exists public.documents (
  id                uuid primary key default gen_random_uuid(),
  entity_type       text not null,
  entity_id         uuid not null,
  document_type_id  uuid references public.document_types(id) on delete set null,
  file_path         text,
  status            text not null default 'pending',
  uploaded_by       uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists documents_entity_idx on public.documents (entity_type, entity_id);
create index if not exists documents_type_idx on public.documents (document_type_id);
create index if not exists documents_uploaded_by_idx on public.documents (uploaded_by);

drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

drop trigger if exists trg_documents_audit_user on public.documents;
create trigger trg_documents_audit_user
  before insert or update on public.documents
  for each row execute function public.set_audit_user();

alter table public.documents enable row level security;

drop policy if exists "documents_select_authenticated" on public.documents;
create policy "documents_select_authenticated"
  on public.documents for select
  using (public.current_user_id() is not null);

drop policy if exists "documents_insert_liquidator_admin" on public.documents;
create policy "documents_insert_liquidator_admin"
  on public.documents for insert
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidator')
  );

drop policy if exists "documents_update_liquidator_admin" on public.documents;
create policy "documents_update_liquidator_admin"
  on public.documents for update
  using (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidator')
  )
  with check (
    public.has_role('admin')
    or public.has_role('supervisor')
    or public.has_role('liquidator')
  );

drop policy if exists "documents_delete_admin" on public.documents;
create policy "documents_delete_admin"
  on public.documents for delete
  using (public.has_role('admin'));

-- Plantillas de documentos
 create table if not exists public.document_templates (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  document_type_id  uuid references public.document_types(id) on delete set null,
  template_type     text not null,
  file_path         text,
  variables         jsonb not null default '[]',
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid
);

create index if not exists document_templates_type_idx on public.document_templates (document_type_id);

drop trigger if exists trg_document_templates_updated_at on public.document_templates;
create trigger trg_document_templates_updated_at
  before update on public.document_templates
  for each row execute function public.set_updated_at();

drop trigger if exists trg_document_templates_audit_user on public.document_templates;
create trigger trg_document_templates_audit_user
  before insert or update on public.document_templates
  for each row execute function public.set_audit_user();

alter table public.document_templates enable row level security;

drop policy if exists "document_templates_select_authenticated" on public.document_templates;
create policy "document_templates_select_authenticated"
  on public.document_templates for select
  using (public.current_user_id() is not null);

drop policy if exists "document_templates_insert_admin" on public.document_templates;
create policy "document_templates_insert_admin"
  on public.document_templates for insert
  with check (public.has_role('admin'));

drop policy if exists "document_templates_update_admin" on public.document_templates;
create policy "document_templates_update_admin"
  on public.document_templates for update
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

drop policy if exists "document_templates_delete_admin" on public.document_templates;
create policy "document_templates_delete_admin"
  on public.document_templates for delete
  using (public.has_role('admin'));
