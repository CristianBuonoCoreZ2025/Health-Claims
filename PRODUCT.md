# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary users:** empresas liquidadoras de negocios de salud.

**Job to be done:** liquidar siniestros de salud de forma rápida, precisa y auditiable, integrando proveedores, prestadores, cadenas de farmacias y asegurados en un flujo unificado.

**Situation:** operadores y áreas de liquidación de salud que necesitan reducir tiempos de pago y disminuir pasos manuales en un dominio regulado, multi-tenant y de alto volumen.

## Product Purpose

Centralizar la liquidación de siniestros de salud, reducir tiempos de procesamiento y automatizar los flujos de liquidación para empresas del sector.

## Positioning

El producto se diferencia por la liquidación integrada con cadenas de farmacias y la posibilidad de liquidación inmediata, conectando proveedores, prestaciones y estados del siniestro en un flujo end-to-end que no requiere reconciliación manual entre sistemas separados.

## Operating Context

- **Dominio:** seguros de salud, siniestros médicos, prestaciones, aranceles, proveedores, pólizas, asegurados.
- **Idioma:** español neutro/internacional.
- **Workflows clave:** recepción del siniestro, validación por estados, autorización de prestaciones, liquidación, pago y conciliación.
- **Integraciones relevantes:** cadenas de farmacias, liquidación inmediata (imed), flujos de pago.
- **Entorno técnico:** Next.js 15 + Tailwind v4 + shadcn/ui, Supabase con PostgreSQL, autenticación SSR, multi-tenant.

## Capabilities and Constraints

- **Multi-tenant:** cada empresa/lote de datos aislado.
- **RLS en Supabase:** seguridad a nivel de filas en todas las tablas sensibles.
- **Flujo de siniestros con estados específicos:** workflow estructurado con estados propios del negocio.
- **Liquidación inmediata (imed):** pago/acreditación rápida integrada.
- **Liquidación integrada con cadenas de farmacias:** conexión directa con redes de farmacias para prestaciones.
- **Idioma español neutro:** no se permite argentinismos ni modismos regionales.
- **Datos regulados:** historial médico, montos, identidades y transacciones deben ser auditables y protegidos.

## Brand Commitments

Identidad visual premium, limpia y de confianza institucional/tech, con glassmorphism sutil y paleta cian/teal/azul. Referencia explícita: estilo del proyecto hub-inspection. Modo oscuro obligatorio.

## Evidence on Hand

- Repositorio con codebase Next.js 15, CSS/DS en `src/app/styles`, migraciones Supabase y documentación de arquitectura (`docs/ARCHITECTURE.md`, `AGENTS.md`).
- Diseño actual ya implementado: sistema de tokens, skins, componentes shadcn y layout de dashboard.
- No se dispone de testimoniales, casos de estudio ni datos de uso reales documentados en el repo.

## Product Principles

1. **Confianza antes que velocidad:** los datos financieros y médicos requieren precisión y trazabilidad; la automatización nunca sacrifica la auditabilidad.
2. **Multi-tenant como default:** cada empresa/tenant vive aislada y el diseño debe soportar white-label por empresa.
3. **Español neutro, siempre:** la UI, commits, docs y comunicación usan español internacional sin regionalismos.
4. **Reducción de pasos manuales:** todo flujo de liquidación debe acercarse a la mínima interacción necesaria sin perder control humano.
5. **Integración con el ecosistema de salud:** proveedores, farmacias y asegurados son actores de primer nivel, no datos aislados.
