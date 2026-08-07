# Análisis de brecha — Health-Claims vs. eSalud

Comparación entre la base de datos actual de **Health-Claims** (`63 tablas`) y el sistema legacy **eSalud** (`510 tablas, 2.397 procedimientos almacenados`).

## Resumen de distancia

| Métrica | Health-Claims (actual) | eSalud (legacy) | Cobertura aprox. |
|---|---|---:|---|
| Tablas | 63 | 510 | ~12 % |
| Procedimientos almacenados | 0 | 2.397 | 0 % |
| Módulos principales | 8 fases | ~19 familias de tablas | Variable |
| Lógica de negocio en SP | Ninguna aún | Alta | 0 % |

**Conclusión inicial:** Health-Claims cubre el **esqueleto funcional** (pólizas, asegurados, siniestros, catálogos, operaciones), pero eSalud tiene una **granularidad mucho mayor** en estados, auditoría, documentos, web services, catálogos auxiliares y lógica encapsulada.

---

## Tablas existentes en Health-Claims

```
companies, holdings, contractors, company_branches, company_*_codes (5)
banks, countries, regions, currencies
providers, provider_coverages, specialties
isapres, isapre_plans, pharmacies, laboratories, vademecum
medications, diagnostics, aranceles, coverage_types
document_types, payment_methods, parent_relationships
liquidation_statuses, pending_reasons, dispatch_campaigns
policies, policy_endorsements, policy_conditions, policy_condition_headers, policy_condition_lines
insureds, pre_existing_conditions, insured_addresses, insured_bank_accounts
claims, claim_details, claim_timeline, claim_forms, claim_receipts, claim_dispatches, claim_payments, claim_workflow_stages
profiles, liquidator_*, reassignment_rules, batch_downloads, report_templates
documents, document_templates
```

---

## Mapeo por módulo y brechas

| Módulo | eSalud (tablas aprox.) | Health-Claims | Estado | Brechas principales |
|---|---|---:|---|---|
| **Catálogos maestros** | 80+ (`TIPO_*`, `CODE_*`, `ESTADO_*`, `PATOLOGIAS_*`) | 17 | Parcial | Faltan muchos catálogos de tipos, estados de proceso, códigos específicos del negocio chileno. |
| **Pólizas** | 44+ (`SALUD_POLIZA*`, `POLIZA_*`, `ENDOSO*`) | 6 | Estructura básica | Falta árbol de coberturas, configuración de póliza, historial de versiones, datos de broker/sucursal. |
| **Asegurados** | 21+ (`ASEGURADOS_*`) | 4 | Parcial | Faltan terceros, datos de terceros, histórico de estados, auditoría de cambios. |
| **Prestadores** | 11+ (`PRESTADORES_*`) | 2 | Básico | Faltan convenios, anexos, especialidades múltiples, rating, geolocalización. |
| **Siniestros / Liquidación** | 80+ (`LIQUIDACION_*`, `PRESTACIONES_*`, `S_*`) | 9 | Estructura | Faltan estados de proceso detallados, reservas, reasignaciones históricas, conciliaciones. |
| **Medicamentos** | 8+ (`MEDICAMENTOS_*`) | 2 | Básico | Falta relación con prestadores, convenios, códigos por compañía. |
| **Holding / Contratantes** | 15+ (`HOLDING_*`) | 3 | Bueno | Falta detalle de contratantes, centros de costo, sucursales extendidas. |
| **Usuarios / Permisos** | 35+ (`USUARIOS_*`, `ACCIONES_*`, `ACCESOS*`) | 1 | Muy básico | Health-Claims solo tiene `profiles`; eSalud tiene acciones, subtipos, clases, logs. |
| **Envíos / Documentos** | 12+ (`ENVIOS_*`, `TEMPLATE_*`) | 4 | Inicial | Falta plantillado, correspondencia, envíos físicos y digitales. |
| **Web / Integraciones** | 70+ (`web_*`, `WS_*`, `wsPagos*`) | 0 | No existe | Aún no hay APIs para isapres, bancos, pagos, recepción digital. |

---

## Cobertura por familia funcional

| Familia eSalud | Tablas eSalud (muestra) | Equivalente Health-Claims | Notas |
|---|---|---|---|
| ASEGURADOS_SALUD | `ASEGURADOS_SALUD`, `ASEGURADOS_SALUD_BANCOS`, `ASEGURADOS_SALUD_DATOS_TERCERO` | `insureds`, `insured_bank_accounts` | Faltan terceros y datos extendidos. |
| SALUD_POLIZA | `SALUD_POLIZA`, `SALUD_POLIZA_ENDOSO`, `SALUD_POLIZA_ENDOSO_INTERNO` | `policies`, `policy_endorsements` | Endosos internos no modelados. |
| COBERTURAS / CONDICIONES | `S_COBERTURAS_CIA`, `S_CONDICIONES_PARTICULARES`, `ASEGURADOS_SALUD_ARBOL_COBERTURA` | `policy_condition_headers`, `policy_condition_lines`, `service_groups` | Cobertura jerárquica aún no modelada. |
| LIQUIDACION_SALUD | `LIQUIDACION_SALUD`, `LIQUIDACION_SALUD_ESTADOS_PROCESO` | `claims`, `claim_workflow_stages` | Estados de proceso no migrados. |
| PRESTADORES | `PRESTADORES_*` | `providers` | Faltan anexos y convenios. |
| ACCIONES / USUARIOS | `ACCESOS`, `ACCIONES_*`, `USUARIOS_*` | `profiles` | Módulo de permisos muy incompleto. |
| WEB / WS | `web_*`, `WS_*`, `wsPagos*` | — | Sin equivalente. |

---

## Lógica de negocio: procedimientos almacenados

Health-Claims **no tiene SP**. La lógica está en:
- Repositorios + Zod + TanStack Query (CRUD).
- Hooks y schemas del lado del cliente.

eSalud tiene **2.397 SP** con patrones como:
- `*_ADD`, `*_DEL`, `*_GET`, `*_LIST`, `*_LISTBOX`, `*_UPDATE` (CRUD).
- `LIQUIDACION_*_CALCULA`, `*_PROCESA`, `*_ASIGNA` (lógica de negocio).
- `web_*`, `WS_*` (integración).

**Impacto:** no se puede replicar 1:1. Se debe:
1. Identificar los SP críticos (cálculo de liquidación, asignación, validaciones).
2. Migrar su lógica a Edge Functions o Server Actions.
3. Reemplazar los SP de CRUD por repositorios tipados.

---

## Recomendaciones por orden de prioridad

1. **No escalar más tablas hasta definir el alcance real**: con 510 tablas en eSalud, migrar todo no es viable. Seleccionar subconjuntos por módulo.
2. **Priorizar datos mínimos operativos**: pólizas activas, asegurados vigentes, prestadores y siniestros abiertos del último período.
3. **Catalogar SP críticos**: listar los 50-100 procedimientos que no son CRUD puro.
4. **Crear tablas puente de carga masiva**: tablas `raw_eSalud_*` en Supabase para importar datos sin tocar el modelo limpio, luego transformar.
5. **Mantener eSalud como fuente histórica**: no intentar migrar todo el histórico en una fase; usar consultas federadas o snapshots.

---

## Próximo paso

Definir con qué módulo empezar la migración real y entregar una muestra/anónimo de eSalud (o acceso de solo lectura) para construir la primera **tabla de carga masiva**.
