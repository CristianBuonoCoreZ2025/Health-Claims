# Health Claims — Punto de partida para agente limpio

> Copia todo este archivo como primer mensaje en una nueva sesión con Devin.
> El plan completo aprobado está en `C:\Users\crist\.devin\plans\plan-1f89af9a8520c43b.md`.
> El documento maestro del proyecto está en `C:\Users\crist\Downloads\PROJECT_MASTER.md`.

---

## Contexto

Estoy construyendo **Health Claims**, un sistema profesional para liquidación de siniestros de salud. No es un prototipo: debe quedar listo para producción.

**Stack obligatorio:**
- Next.js 15 App Router + React 19 + TypeScript strict
- TailwindCSS + shadcn/ui
- Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime)
- TanStack Query + TanStack Table + Zustand
- React Hook Form + Zod
- Vercel (deploy)

**Arquitectura limpia obligatoria** (`src/`):
`app/`, `modules/`, `components/`, `services/`, `repositories/`, `hooks/`, `stores/`, `schemas/`, `validators/`, `lib/`, `utils/`, `providers/`, `middleware/`, `types/`

**Reglas de código:**
- Sin `any`, sin TODO, sin `console.log`, sin código comentado
- Máximo 300 líneas por archivo
- Sin duplicación de lógica
- Migraciones Supabase CLI versionadas (nunca SQL manual)
- Toda tabla con RLS
- UUID como PK, columnas `created_at, updated_at, created_by, updated_by`
- Service role jamás en frontend
- Desktop first + vistas móviles específicas (no adaptar desktop)
- Tema claro/oscuro + accesibilidad

**Verificación obligatoria antes de cerrar cada módulo:**
`npm run lint` + `npm run typecheck` + `npm run build` → todo limpio.

---

## Estado actual del proyecto (lo que YA está hecho)

**Workspace:** `C:\Projects\NextJs\Health-Claims\` (raíz, sin subcarpetas)

**Git:** repo inicializado en rama `main`, sin commits todavía. Archivos sin trackear.

**Proyecto Next.js base creado** con `create-next-app` (App Router, TS, Tailwind, ESLint, src dir, import alias `@/*`). Archivos presentes:
- `package.json` — **actualizado a Next.js 15.5.20 + React 19.2.8** (downgrade desde 16.3 ya hecho en el archivo)
- `tsconfig.json` — strict mode, paths `@/*` → `./src/*`
- `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`
- `src/app/{layout.tsx, page.tsx, globals.css, favicon.ico}` (plantilla default de create-next-app)
- `public/`, `.gitignore`, `README.md` (default)
- `node_modules/` y `package-lock.json` — **instalación stale de Next.js 16.3** (hay que reinstalar)

**Lo que NO está hecho todavía:**
- `npm install` con las versiones fijas de Next 15 (la instalación se interrumpió)
- Estructura de carpetas de arquitectura limpia
- Dependencias del stack (shadcn, TanStack, Zustand, RHF, Zod, @supabase/ssr, sonner, etc.)
- Supabase CLI + migraciones
- Auth, RLS, Storage
- Documentación del proyecto

---

## Decisiones técnicas ya acordadas (no volver a preguntar)

| Decisión | Valor |
|---|---|
| Framework | Next.js 15.5.20 + React 19.2.8 + TypeScript strict |
| Supabase | Proyecto nuevo — el usuario lo crea en el Dashboard y proporciona URL + anon key (+ service role solo server) |
| Alcance módulo 1 | Arquitectura + DB inicial + Auth + RLS base + Storage bucket (Fase 1 completa del roadmap) |
| Git | Init local, rama `feat/foundation` por módulo, commits pequeños, sin push (no hay repo en GitHub todavía) |
| Tailwind | v4 (ya viene con create-next-app) |
| Auth | `@supabase/ssr` (Email/Password + roles en tabla `profiles`) |
| Migraciones | Supabase CLI, 9 migraciones iniciales (ver plan) |

---

## Próximo paso inmediato

1. **Reinstalar dependencias** con el `package.json` ya fijado en Next 15.5.20:
   - Borrar `node_modules` y `package-lock.json` si están stale
   - `npm install`
   - Verificar que `next --version` reporte 15.5.20

2. **Continuar con el plan aprobado** desde el paso "Dependencias y tooling":
   - Crear estructura de carpetas limpia
   - Instalar shadcn/ui + componentes base
   - Instalar TanStack Query/Table, Zustand, RHF+Zod, @supabase/ssr, sonner, next-themes, date-fns, lucide-react, clsx, tailwind-merge
   - Configurar scripts `lint`, `typecheck`, `build`, `db:gen`
   - Configurar ESLint estricto (sin any, sin console.log, sin TODO)

3. **Luego** Supabase CLI + 9 migraciones iniciales (ver plan para detalle exacto de cada migración).

4. **Luego** capa de datos, Auth UI, layout autenticado, schemas, documentación.

5. **Al final** verificar lint + typecheck + build limpios, commitear en `feat/foundation`.

---

## Cómo continuar

Lee el plan completo en `C:\Users\crist\.devin\plans\plan-1f89af9a8520c43b.md` y el documento maestro en `C:\Users\crist\Downloads\PROJECT_MASTER.md`, luego continúa la implementación desde el punto donde quedamos (reinstalar dependencias con Next 15.5.20 y seguir el plan paso a paso).

Trabaja por módulos completos. No avances al siguiente paso dejando errores pendientes. Documenta cada decisión técnica.
