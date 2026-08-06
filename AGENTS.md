# AGENTS.md — Health Claims

Guia para agentes de codigo (Devin u otros) que trabajan en este repo.

## Stack

- Next.js 15.5.22 (App Router) + React 19.2.8 + TypeScript strict
- TailwindCSS v4 + shadcn/ui (radix-nova)
- Supabase (PostgreSQL, Auth, Storage) via @supabase/ssr
- TanStack Query + TanStack Table + Zustand
- React Hook Form + Zod

## Comandos de verificacion (obligatorios antes de cerrar una tarea)

```bash
pnpm lint        # eslint .  -> 0 errores
pnpm typecheck   # tsc --noEmit -> 0 errores
pnpm build       # next build -> exitoso
```

Si alguno falla, corregir antes de marcar la tarea como completada.

## Comandos de base de datos

```bash
pnpm db:gen      # regenera src/types/database.generated.ts (requiere SUPABASE_PROJECT_ID)
pnpm db:push     # aplica migraciones pendientes al proyecto vinculado
pnpm db:reset    # reinicia DB local y reaplica migraciones
```

## Reglas de codigo (no negociables)

- Sin `any`, sin `console.log`, sin TODO/FIXME, sin codigo comentado.
- Maximo 300 lineas por archivo.
- Sin duplicacion de logica.
- Import alias `@/*` -> `./src/*`.
- Toda tabla con RLS; UUID PK; columnas `created_at, updated_at, created_by, updated_by`.
- Migraciones via Supabase CLI (nunca SQL manual en el dashboard).
- `SUPABASE_SERVICE_ROLE_KEY` jamas en codigo de cliente.
- Desktop first; vistas moviles especificas (no adaptar desktop).

## Estructura

Ver `docs/ARCHITECTURE.md` para el detalle de cada carpeta de `src/`.

## Migraciones

Ver `supabase/README.md` y `docs/MIGRATIONS.md`. Las migraciones se aplican en
orden por timestamp; usar `if not exists` / `drop ... if exists` para
idempotencia.

## Notas de seguridad conocidas

`pnpm audit` reporta vulnerabilidades transitorias en dependencias internas de
`next` (postcss, sharp) y `exceljs` (uuid) cuyas fixes requieren `next@16` o
`exceljs@3` (breaking changes rechazados por decision del proyecto: pin Next
15.5.x). No aplicar `pnpm audit fix --force`. Revisar periodicamente.

## Tipos de Supabase

`src/types/database.generated.ts` es una version manual que refleja las
migraciones iniciales. Tras vincular el proyecto, ejecutar `pnpm db:gen` para
regenerarlo desde el schema remoto (formato compatible con @supabase/supabase-js).
