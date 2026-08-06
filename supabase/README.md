# Supabase — Health Claims

Migraciones versionadas gestionadas con Supabase CLI. **Nunca** se ejecuta SQL
manual en el dashboard; todo cambio al esquema vive como archivo en
`supabase/migrations/`.

## Requisitos

- Supabase CLI >= 2.109 (`supabase --version`)
- Un proyecto Supabase creado en el dashboard (URL + anon key + service role key)

## Configuracion inicial (una sola vez)

```bash
# 1. Vincular el proyecto local al proyecto remoto (pide access token / project ref)
supabase link --project-ref <PROJECT_REF>

# 2. Aplicar todas las migraciones pendientes al proyecto remoto
npm run db:push        # equivale a: supabase db push

# 3. Regenerar tipos TypeScript para el frontend
npm run db:gen         # requiere SUPABASE_PROJECT_ID en el entorno
```

> `db:gen` escribe `src/types/database.generated.ts` (commitado para builds
> estables). Volver a ejecutarlo tras cualquier migracion que cambie el esquema.

## Desarrollo local (opcional)

```bash
npm run supabase:start   # levanta stack local (Postgres, Auth, Storage, Realtime)
npm run supabase:stop    # detiene el stack local
npm run db:reset         # reinicia la DB local y reaplica migraciones
```

## Migraciones iniciales (Fase 1)

| # | Archivo | Proposito |
|---|---|---|
| 1 | `00000000000001_extensions.sql` | Extensiones `pgcrypto`, `pg_trgm`, `uuid-ossp`. |
| 2 | `00000000000002_audit_helpers.sql` | Helpers reutilizables: `current_user_id()`, `set_updated_at()`, `set_audit_user()`. |
| 3 | `00000000000003_profiles_and_roles.sql` | Tabla `profiles` (1:1 con `auth.users`), enum `app_role` (`admin`/`supervisor`/`liquidator`), trigger `handle_new_user`, `current_user_role()`, `has_role()`, RLS. |
| 4 | `00000000000004_companies.sql` | Companias aseguradoras con `holding_id` auto-referencial. RLS: lectura autenticados, escritura admin. |
| 5 | `00000000000005_providers.sql` | Prestadores de salud. RLS: lectura autenticados, escritura admin/supervisor. |
| 6 | `00000000000006_diagnostics.sql` | Catalogo CIE-10 con `tsvector` + indices GIN (busqueda full-text y trigram). |
| 7 | `00000000000007_medications.sql` | Catalogo de medicamentos con busqueda trigram por nombre. |
| 8 | `00000000000008_coverage_types.sql` | Tipos de cobertura. |
| 9 | `00000000000009_storage_claims_documents.sql` | Bucket `claims_documents` (10 MB, MIME permitidos) + politicas RLS sobre `storage.objects`. |

### Nota de orden

El plan original ubicaba `audit_helpers` como migracion #8. Se movio a #2
(justo despues de `extensions`) porque las tablas (#3-#8) referencian
`set_updated_at()` y `set_audit_user()` en sus triggers. Definir los helpers
primero evita duplicar logica y permite que las migraciones apliquen en orden
sin errores.

## Conveniones

- PK UUID (`gen_random_uuid()`).
- Columnas de auditoria obligatorias: `created_at`, `updated_at`, `created_by`, `updated_by`.
- Trigger `set_updated_at` en cada tabla con `updated_at`.
- Trigger `set_audit_user` en cada tabla con `created_by`/`updated_by`.
- RLS habilitada en **todas** las tablas; politica base `current_user_id() is not null`.
- Soft delete via `is_active boolean` donde aplica (no se borra fila).
