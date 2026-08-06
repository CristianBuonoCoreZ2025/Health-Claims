# Migraciones — Health Claims

Migraciones versionadas en `supabase/migrations/`, gestionadas con Supabase CLI.
Ver `supabase/README.md` para el flujo de aplicacion (`supabase link`,
`npm run db:push`, `npm run db:gen`).

## Migraciones iniciales (Fase 1)

| # | Archivo | Proposito |
|---|---|---|
| 1 | `00000000000001_extensions.sql` | `pgcrypto`, `pg_trgm`, `uuid-ossp`. |
| 2 | `00000000000002_audit_helpers.sql` | `current_user_id()`, `set_updated_at()`, `set_audit_user()`. |
| 3 | `00000000000003_profiles_and_roles.sql` | `profiles` (1:1 `auth.users`), enum `app_role`, trigger `handle_new_user`, `current_user_role()`, `has_role()`, RLS. |
| 4 | `00000000000004_companies.sql` | Companias con `holding_id` auto-referencial. RLS: lectura auth, escritura admin. |
| 5 | `00000000000005_providers.sql` | Prestadores. RLS: lectura auth, escritura admin/supervisor. |
| 6 | `00000000000006_diagnostics.sql` | CIE-10 con `tsvector` + GIN (full-text y trigram). |
| 7 | `00000000000007_medications.sql` | Medicamentos con trigram por nombre. |
| 8 | `00000000000008_coverage_types.sql` | Tipos de cobertura. |
| 9 | `00000000000009_storage_claims_documents.sql` | Bucket `claims_documents` (10 MB, MIME) + RLS sobre `storage.objects`. |

## Nota de orden

El plan original ubicaba `audit_helpers` como migracion #8. Se movio a #2
(justo despues de `extensions`) porque las tablas (#3-#8) referencian
`set_updated_at()` y `set_audit_user()` en sus triggers. Definir los helpers
primero evita duplicar logica y permite que las migraciones apliquen en orden.

## Tablas pendientes (fases siguientes)

Las tablas de negocio del roadmap (`policies`, `policy_conditions`, `insureds`,
`claims`, `claim_details`, `claim_timeline`, `liquidator_weights`) se anaden en
sus modulos correspondientes como nuevas migraciones con timestamp posterior.

## Politicas RLS por defecto

- Lectura base: `current_user_id() is not null` (cualquier autenticado).
- Escritura sensible: `has_role('admin')` (y `supervisor` donde aplica).
- `profiles`: lectura propia o staff; update propia o admin; insert admin
  (el trigger `handle_new_user` corre como `security definer`).
- `storage.objects` (`claims_documents`): lectura auth; escritura
  admin/supervisor/liquidator; borrado admin. El control fino "por asignacion"
  se anade en el modulo de Liquidacion.
