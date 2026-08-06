# Arquitectura — Health Claims

Arquitectura limpia por capas bajo `src/`. Cada carpeta tiene una unica
responsabilidad. Desktop first + vistas moviles especificas (no adaptar desktop).

```
src/
  app/            Rutas App Router (page, layout, route handlers, route groups)
    (auth)/       Grupo de rutas de autenticacion (login, auth/callback)
    (dashboard)/  Grupo de rutas autenticadas (layout con sidebar + header)
  modules/        Modulos de negocio por dominio (configuracion, polizas, liquidacion...)
  components/
    ui/           Componentes shadcn/ui (button, dialog, table, form, etc.)
    layout/       Componentes de layout (sidebar, header, user-menu, theme-toggle)
  services/       Servicios de aplicacion (auth.service) que orquestan repositorios
  repositories/   Acceso a datos (BaseRepository CRUD generico + repos por entidad)
  hooks/          Hooks de React (use-current-user, use-auth)
  stores/         Stores Zustand (auth.store)
  schemas/        Esquemas Zod (auth.schema)
  validators/     Validadores de dominio (rut.validator)
  lib/
    supabase/     Clientes Supabase (server, client, middleware)
    utils.ts      Helper cn (clsx + tailwind-merge)
  utils/          Utilidades de dominio (format: fechas, RUT, moneda, roles)
  providers/      Providers de app (query-provider, theme-provider)
  middleware/     (reservado) middlewares de dominio
  middleware.ts   Middleware Next.js (proteccion de rutas + refresh de sesion)
  types/          Tipos: database.generated.ts (Supabase) + index.ts (dominio)
```

## Convenciones

- **Sin `any`**, sin `console.log`, sin TODO, sin codigo comentado.
- Maximo 300 lineas por archivo.
- Sin duplicacion de logica.
- Import alias `@/*` -> `./src/*`.
- Toda tabla con RLS; UUID como PK; columnas `created_at, updated_at, created_by, updated_by`.
- Service role jamas en frontend.
- Tema claro/oscuro via `next-themes` (clase `.dark`) + tokens CSS en `globals.css`.

## Flujo de autenticacion

1. `src/middleware.ts` refresca la sesion (`updateSession`) y redirige a `/login`
   si no hay usuario en rutas protegidas (`/dashboard`, `/configuracion`,
   `/polizas`, `/liquidacion`, `/operaciones`).
2. `/login` usa RHF + Zod + cliente browser de Supabase
   (`signInWithPassword`), que setea cookies de sesion.
3. `src/app/(dashboard)/layout.tsx` obtiene la sesion server-side (`getSession`),
   hidrata el store Zustand (`AuthHydrator`) y renderiza sidebar + header.
4. Cierre de sesion via `useAuth().signOutClient` (cliente) o `signOut()` (server).

## Patron repositorio

- `BaseRepository<T>`: CRUD generico tipado (`findAll`, `findById`, `insert`,
  `update`, `softDelete`, `remove`) + factory de query keys (`queryKeys`).
- Repos por entidad extienden `BaseRepository` y anaden metodos de dominio
  (ej. `ProfilesRepository.getByUserId`, `getByRole`).
- Los hooks consumen repositorios via TanStack Query usando `queryKeys`.
