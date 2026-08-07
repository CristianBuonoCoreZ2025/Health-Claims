# Plan avanzado de migración — eSalud → Health-Claims

> Análisis realizado sobre el script `F:\Sql\Bases de Datos\Bases\Script\eSalud.sql`.

## Resumen del inventario

| Tipo de objeto | Cantidad |
|---|---:|
| Tablas | 510 |
| Procedimientos almacenados | 2.397 |
| **Total CREATE** | **2.907** |

El script corresponde a un sistema **legacy de salud (eSalud)** escrito para SQL Server. La estrategia no es migrar 1:1 los 2.397 procedimientos, sino **mapear la lógica de negocio** a una arquitectura moderna: Supabase (PostgreSQL + Edge Functions) + Server Actions de Next.js.

---

## Módulos identificados por prefijo

| Módulo | Prefijos clave | Cantidad aprox. de tablas | Descripción |
|---|---:|---|---|
| **Liquidación / Siniestros** | `LIQUIDACION_*`, `PRESTACIONES_*`, `S_*` | 80+ | Core del negocio: siniestros, prestaciones, estados de proceso, liquidación. |
| **Pólizas** | `POLIZA_*`, `SALUD_POLIZA*`, `ENDOSO*` | 44+ | Pólizas, endosos, condiciones particulares, árbol de coberturas. |
| **Asegurados** | `ASEGURADOS_*` | 21+ | Titulares, cargas, datos bancarios, estados, terceros. |
| **Prestadores** | `PRESTADORES_*` | 11+ | Red de prestadores, especialidades, convenios. |
| **Holding / Contratantes** | `HOLDING_*` | 15+ | Grupos empresariales, contratantes, filiales. |
| **Catálogos maestros** | `TIPO_*`, `CODE_*`, `ESTADO_*`, `PATOLOGIAS_*` | 60+ | Catálogos de tipos, códigos, estados, patologías. |
| **Medicamentos** | `MEDICAMENTOS_*` | 8+ | Vademecum, fármacos, laboratorios. |
| **Usuarios y permisos** | `USUARIOS_*`, `ACCESOS*`, `ACCIONES_*` | 35+ | Perfiles, permisos, acciones, subtipos, logs. |
| **Envíos / Documentos** | `ENVIOS_*`, `TEMPLATE_*` | 12+ | Despachos, remesas, plantillas de documentos. |
| **Integración Web** | `web_*`, `WS_*`, `wsPagos*` | 70+ | APIs legacy, web services, pagos. |

### Prefijos más frecuentes en tablas

| Prefijo | Cantidad |
|---|---:|
| LIQUIDACION | 56 |
| web | 47 |
| SALUD | 38 |
| TIPO | 38 |
| PRESTACIONES | 24 |
| S | 23 |
| ASEGURADOS | 21 |
| HOLDING | 15 |
| USUARIOS | 14 |
| wsPagos | 13 |
| PRESTADORES | 11 |
| ACCIONES | 10 |
| WS | 9 |
| CODE | 9 |
| MEDICAMENTOS | 8 |
| ENVIOS | 7 |
| ESTADO | 6 |
| POLIZA | 6 |
| PATOLOGIAS | 5 |
| TEMPLATE | 5 |

### Ejemplos de tablas relevantes

- `SALUD_POLIZA`, `SALUD_POLIZA_ENDOSO`, `SALUD_POLIZA_ENDOSO_INTERNO`, `POLIZA_SALUD_ARBOL_CONFIG`
- `ASEGURADOS_SALUD`, `ASEGURADOS_SALUD_ARBOL_COBERTURA`, `ASEGURADOS_SALUD_BANCOS`, `ASEGURADOS_SALUD_DATOS_TERCERO`
- `LIQUIDACION_SALUD`, `LIQUIDACION_SALUD_ESTADOS_PROCESO`
- `S_COBERTURAS_CIA`, `S_CONDICIONES_PARTICULARES`
- `PRESTADORES_*`, `MEDICAMENTOS_*`

### Patrón de procedimientos almacenados

Ejemplos extraídos del inicio del script:

- `ACCESOS_ADD`, `ACCIONES_CLASES_ADD`, `ACCIONES_CLASES_DEL`, `ACCIONES_CLASES_GET`, `ACCIONES_CLASES_LIST`, `ACCIONES_CLASES_LISTBOX`, `ACCIONES_CLASES_UPDATE`
- `ACCIONES_SUBTIPOS_ADD`, `ACCIONES_SUBTIPOS_DEL`, `ACCIONES_SUBTIPOS_GET`, `ACCIONES_SUBTIPOS_LIST`, `ACCIONES_SUBTIPOS_UPDATE`

**Observaciones:**
- Convención CRUD: `_ADD`, `_DEL`, `_GET`, `_LIST`, `_LISTBOX`, `_UPDATE`.
- Gran cantidad de `_LISTBOX` indica catálogos para combos/selectores.
- Muchos procedimientos son wrappers simples de tabla → se reemplazan por repositorios + TanStack Query en Health-Claims.
- Procedimientos con lógica compleja (cálculo de liquidación, asignación, validaciones) deben migrarse a **Edge Functions** o **Server Actions** documentadas.

---

## Plan de migración avanzado

### Fase 0 — Descubrimiento y mapeo (no destructiva)
1. Generar inventario completo de tablas y procedimientos (ya parcialmente realizado).
2. Relacionar tablas eSalud con las tablas de Health-Claims existentes.
3. Identificar stored procedures críticos vs. wrappers simples.
4. Extraer muestras de datos (CSV/JSON) para validar tipos y cardinalidad.

### Fase 1 — Catálogos maestros
- Migrar tablas `TIPO_*`, `CODE_*`, `ESTADO_*`, `PATOLOGIAS_*` y catalogos equivalentes (`countries`, `regions`, `currencies`, `banks`, `isapres`, etc.).
- Mapear `_LISTBOX` a `use-catalogs` y repositorios.
- Cargar datos iniciales vía seed/migraciones.

### Fase 2 — Pólizas, endosos y condiciones
- `SALUD_POLIZA` → `policies`
- `SALUD_POLIZA_ENDOSO` → `policy_endorsements`
- `S_COBERTURAS_CIA`, `S_CONDICIONES_PARTICULARES` → `policy_condition_headers` / `policy_condition_lines`
- Validar campos adicionales de la póliza no presentes aún.

### Fase 3 — Asegurados y preexistencias
- `ASEGURADOS_SALUD` y tablas hijas → `insureds`, `pre_existing_conditions`.
- Bancos de asegurados → `insured_bank_accounts` (si no existe, crear).
- Terceros → extensión de `insureds` o tabla `beneficiaries`.

### Fase 4 — Prestadores y medicamentos
- Mapear `PRESTADORES_*` a `providers` + especialidades.
- Mapear `MEDICAMENTOS_*` a `medications` / `vademecum`.

### Fase 5 — Siniestros y liquidación
- `LIQUIDACION_SALUD` y `PRESTACIONES_*` → `claims`, `claim_details`, `claim_forms`, `claim_payments`, `claim_workflow_stages`.
- Migrar estados de proceso (`LIQUIDACION_SALUD_ESTADOS_PROCESO`) a workflow E/R/A.
- Reescribir SP de cálculo de liquidación como Edge Function o Server Action.

### Fase 6 — Usuarios, permisos y auditoría
- `USUARIOS_*`, `ACCESOS*`, `ACCIONES_*` → `profiles` + `user_roles` + RLS.
- Mapear subtipos de acciones a permisos granulares.

### Fase 7 — Integraciones y documentos
- `web_*`, `WS_*`, `wsPagos*` → Edge Functions / API routes.
- `ENVIOS_*`, `TEMPLATE_*` → `documents` y `document_templates`.

### Fase 8 — Cutover
- Carga histórica masiva vía scripts controlados.
- Reconciliación de totales (pólizas, asegurados, siniestros).
- Paralelo: eSalud sigue operando hasta validación.

---

## Consideraciones técnicas

- **No migrar los 2.397 SP uno a uno**. La mayoría son CRUD reemplazables por repositorios tipados.
- **SQL Server → PostgreSQL**: ajustar tipos, `IDENTITY` → `gen_random_uuid()`, fechas, cadenas vacías.
- **RLS**: cada tabla de negocio debe tener políticas por rol.
- **Auditoría**: `created_at`, `updated_at`, `created_by`, `updated_by` y triggers de auditoría ya están en Health-Claims.
- **Data fix**: muchas tablas `*_REPETIDOS`, `*_LOGS`, `*_ESTADOS` sugieren que eSalud maneja duplicados y estados explícitos; analizar antes de migrar.

---

## Próximo paso inmediato

Decidir el **módulo prioritario** para la primera migración real de datos (recomendado: catálogos → pólizas → asegurados → liquidación) y proporcionar un backup o muestra de datos de eSalud para comenzar la extracción.
