# Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores desde el dashboard de
Supabase (Project Settings > API).

| Variable | Ambito | Descripcion |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Publica (cliente + server) | URL del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publica (cliente + server) | Anon key. Usa RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo server** | Service role key. Bypass RLS. NUNCA en cliente. |
| `SUPABASE_PROJECT_ID` | Build/CLI | Project ref para `npm run db:gen`. |

## Seguridad

- `SUPABASE_SERVICE_ROLE_KEY` **solo** debe usarse en Server Components, Route
  Handlers, Server Actions y Edge Functions. Nunca importarla en
  `src/lib/supabase/client.ts` ni en ningun archivo con `"use client"`.
- `.env.local` esta en `.gitignore`. `.env.example` (plantilla sin secretos) si
  se commitea.
- En Vercel, configurar las mismas variables en Project Settings > Environment
  Variables (marcar `SUPABASE_SERVICE_ROLE_KEY` como sensible).

## Verificacion rapida

Sin las variables configuradas, la app compila y hace build (las rutas que
usan sesion son dinamicas y no se prerrenderizan). El flujo de autenticacion
completo requiere el proyecto Supabase vinculado y las migraciones aplicadas.
