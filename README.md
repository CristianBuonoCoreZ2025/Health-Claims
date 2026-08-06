# Health Claims

Sistema profesional para liquidacion de siniestros de salud. Listo para
produccion (no es un prototipo).

## Stack

- **Next.js 15.5.22** (App Router) + **React 19.2.8** + **TypeScript strict**
- **TailwindCSS v4** + **shadcn/ui** (desktop first, tema claro/oscuro)
- **Supabase** (PostgreSQL, Auth, Storage, Edge Functions, Realtime)
- **TanStack Query** + **TanStack Table** + **Zustand**
- **React Hook Form** + **Zod**
- **Vercel** (deploy)

## Arquitectura

Arquitectura limpia por capas bajo `src/`. Ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

```
src/
  app/  modules/  components/  services/  repositories/  hooks/
  stores/  schemas/  validators/  lib/  utils/  providers/
  middleware/  types/  middleware.ts
```

## Requisitos

- Node 20+ (probado con Node 24)
- pnpm 11+ (`pnpm --version`)
- Supabase CLI >= 2.109 (`supabase --version`)
- Un proyecto Supabase creado en el dashboard

## Puesta en marcha

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar entorno
cp .env.example .env.local
#   completa NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#   SUPABASE_SERVICE_ROLE_KEY y SUPABASE_PROJECT_ID desde el dashboard de Supabase

# 3. Vincular y aplicar migraciones
supabase link --project-ref <PROJECT_REF>
pnpm db:push

# 4. Regenerar tipos desde el schema remoto
pnpm db:gen

# 5. Levantar el entorno de desarrollo
pnpm dev
```

> Sin variables de entorno la app compila y hace build; el flujo de
> autenticacion completo requiere Supabase vinculado y migraciones aplicadas.

## Scripts

| Script | Descripcion |
|---|---|
| `pnpm dev` | Servidor de desarrollo. |
| `pnpm build` | Build de produccion. |
| `pnpm start` | Servidor de produccion. |
| `pnpm lint` | ESLint (config estricta). |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm db:gen` | Genera `src/types/database.generated.ts`. |
| `pnpm db:push` | Aplica migraciones pendientes. |
| `pnpm db:reset` | Reinicia DB local y reaplica migraciones. |
| `pnpm supabase:start` | Levanta stack Supabase local. |
| `pnpm supabase:stop` | Detiene stack Supabase local. |

## Verificacion (Definition of Done)

Antes de cerrar cualquier modulo:

```bash
pnpm lint && pnpm typecheck && pnpm build
```

Todo debe pasar limpio (0 errores).

## Documentacion

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — estructura de `src/`.
- [`docs/MIGRATIONS.md`](docs/MIGRATIONS.md) — migraciones y RLS.
- [`docs/ENV.md`](docs/ENV.md) — variables de entorno.
- [`supabase/README.md`](supabase/README.md) — flujo de migraciones.
- [`AGENTS.md`](AGENTS.md) — guia para agentes de codigo.

## Estado por modulo

| Modulo | Estado |
|---|---|
| Fundacion (arquitectura, DB inicial, Auth, RLS, Storage) | Hecho (Fase 1) |
| Configuracion (companias, prestadores, diagnosticos, aranceles, medicamentos) | Pendiente |
| Polizas (contratos, condiciones, asegurados) | Pendiente |
| Liquidacion de siniestros (core) | Pendiente |
| Operaciones y control de liquidadores | Pendiente |
| Vistas moviles (PWA) | Pendiente |
| Reportes / export | Pendiente |

## Seguridad

- `SUPABASE_SERVICE_ROLE_KEY` solo en server. Nunca en cliente.
- Toda tabla con RLS. Politica base: `current_user_id() is not null`.
- `.env.local` en `.gitignore`; `.env.example` (plantilla) si se commitea.
- Vulnerabilidades transitorias conocidas en deps internas de `next`/`exceljs`
  (ver `AGENTS.md`); no aplicar `pnpm audit fix --force`.
