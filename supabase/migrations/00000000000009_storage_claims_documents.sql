-- Bucket de Storage para documentos de siniestros.
-- Politicas RLS base sobre storage.objects; el control fino "por asignacion"
-- (liquidador ve solo docs de siniestros asignados) se anade en el modulo de
-- Liquidacion cuando exista la tabla claims y la relacion claim <-> documento.

-- Crear el bucket claims_documents (publico para lectura autenticada, privado por defecto).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'claims_documents',
  'claims_documents',
  false,
  10485760, -- 10 MB por archivo
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do nothing;

-- Lectura: cualquier usuario autenticado puede leer objetos del bucket.
drop policy if exists "claims_documents_read_authenticated" on storage.objects;
create policy "claims_documents_read_authenticated"
  on storage.objects for select
  using (
    bucket_id = 'claims_documents'
    and public.current_user_id() is not null
  );

-- Escritura (insert): admin, supervisor y liquidator pueden subir documentos.
drop policy if exists "claims_documents_insert_staff" on storage.objects;
create policy "claims_documents_insert_staff"
  on storage.objects for insert
  with check (
    bucket_id = 'claims_documents'
    and public.current_user_role() in ('admin', 'supervisor', 'liquidator')
  );

-- Actualizacion de metadata: admin y supervisor.
drop policy if exists "claims_documents_update_staff" on storage.objects;
create policy "claims_documents_update_staff"
  on storage.objects for update
  using (
    bucket_id = 'claims_documents'
    and public.current_user_role() in ('admin', 'supervisor')
  );

-- Borrado: solo admin.
drop policy if exists "claims_documents_delete_admin" on storage.objects;
create policy "claims_documents_delete_admin"
  on storage.objects for delete
  using (
    bucket_id = 'claims_documents'
    and public.has_role('admin')
  );
