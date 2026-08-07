# Brecha de lógica — tablas eSalud vs. Health-Claims

> Análisis basado en el uso real de las **510 tablas** dentro de los **2.397 procedimientos almacenados** de eSalud.

## Hallazgo principal

- **510 tablas** en el script de eSalud.
- **30 tablas (5,9 %) no son referenciadas por ningún SP**.
- **117 tablas (22,9 %) son referenciadas por solo 1 o 2 SP**.
- Las **tablas activas y relevantes** se reducen a **~363** usadas en 3 o más SP.
- Las **top 50 tablas más usadas** concentran la mayor parte de la lógica de negocio.

Esto cambia la estimación de migración: **no son 510 tablas, sino aproximadamente 100-150 tablas críticas**, más catálogos de soporte.

---

## Top tablas eSalud por uso real y su equivalente en Health-Claims

| eSalud | SP que la usan | Equivalente Health-Claims | Estado | Notas |
|---|---|---|---|---|
| `SALUD_POLIZA` | 323 | `policies` | Parcial | Core de pólizas. Faltan campos de broker/corredor, sucursal, plan. |
| `SALUD_POLIZA_ENDOSO_INTERNO` | 356 | `policy_endorsements` | Parcial | Endosos internos; Health-Claims solo tiene endosos generales. |
| `SALUD_POLIZA_ENDOSO` | 255 | `policy_endorsements` | Parcial | Endosos comunes. |
| `HOLDING_EMPRESAS` | 289 | `holdings` | Bueno | Holding/grupo empresarial ya existe. |
| `ASEGURADOS_SALUD` | 272 | `insureds` | Parcial | Asegurados. Faltan datos extendidos y terceros. |
| `POLIZA_SALUD_ARBOL_CONFIG` | 198 | — | No existe | Árbol de coberturas de póliza. Tabla crítica. |
| `NIVEL` | 173 | — | No existe | Niveles de cobertura. Relacionado con árbol. |
| `S_CONDICIONES_PARTICULARES` | 167 | `policy_conditions` / `policy_condition_headers` | Parcial | Condiciones particulares ya modeladas v1/v2. |
| `LIQUIDACION_SALUD` | 333 | `claims` | Parcial | Core de siniestros/liquidación. Más campos y estados. |
| `LIQUIDACION_SALUD_DETALLE` | 164 | `claim_details` | Parcial | Detalle de prestaciones. |
| `LIQUIDACION_SALUD_ACCIONES` | 133 | `claim_workflow_stages` | Parcial | Acciones/gestiones del siniestro. |
| `LIQUIDACION_SALUD_ESTADOS` | 82 | `liquidation_statuses` / `claim_workflow_stages` | Parcial | Estados de liquidación. |
| `LIQUIDACION_SALUD_ESTADOS_PROCESO` | 48 | `claim_workflow_stages` | Parcial | Máquina de estados del proceso. |
| `LIQUIDACION_SALUD_ESTADOS_SITUACION` | 52 | `claim_workflow_stages` | Parcial | Situación del siniestro. |
| `COBERTURAS` | 123 | `coverage_types` | Parcial | Tipos de cobertura. |
| `S_COBERTURAS` | 121 | `coverage_types` / `provider_coverages` | Parcial | Coberturas por compañía/prestador. |
| `S_TIPOS_COBERTURA` | 107 | `coverage_types` | Parcial | Clasificación de coberturas. |
| `CONTRATANTE` | 112 | `contractors` | Bueno | Contratante ya existe. |
| `HOLDING_CONTRATANTE` | 40 | `contractors` / `holdings` | Bueno | Relación holding-contratante. |
| `S_PLAN` | 92 | `isapre_plans` | Parcial | Planes isapre. |
| `PRESTADORES` | 106 | `providers` | Parcial | Prestadores. Faltan anexos y convenios. |
| `PRESTACIONES_FGR` | 89 | `service_items` / `service_groups` | Parcial | Prestaciones. |
| `PRESTACIONES_N3` | 87 | `service_items` / `service_subgroups` | Parcial | Prestaciones por nivel. |
| `DIAGNOSTICOS` | 50 | `diagnostics` | Bueno | Diagnósticos. |
| `MEDICAMENTOS` | 32 | `medications` | Parcial | Medicamentos. |
| `FARMACIAS` | 26 | `pharmacies` | Bueno | Farmacias. |
| `LABORATORIOS` | — | `laboratories` | Bueno | Laboratorios. |
| `ISAPRE` | 60 | `isapres` | Bueno | Isapres. |
| `MONEDAS` | 55 | `currencies` | Bueno | Monedas. |
| `BANCOS` | 40 | `banks` | Bueno | Bancos. |
| `PAIS` | 45 | `countries` | Bueno | Países. |
| `FORMA_PAGO` | 35 | `payment_methods` | Bueno | Formas de pago. |
| `PARENTESCO` | 54 | `parent_relationships` | Bueno | Parentescos. |
| `TIPO_DOCUMENTOS` | 64 | `document_types` | Bueno | Tipos de documento. |
| `TIPO_CUENTA` | 30 | — | No existe | Tipo de cuenta bancaria. |
| `USUARIOS` | 212 | `profiles` | Muy básico | Usuarios. eSalud tiene mucho más. |
| `USUARIOS_EMPRESA` | 194 | — | No existe | Relación usuario-empresa. |
| `USUARIOS_ACTIVIDADES` | 39 | — | No existe | Auditoría de actividades. |
| `ACCIONES_SUBTIPOS` | 38 | — | No existe | Módulo de permisos/acciones. |
| `CORREDOR` | 74 | — | No existe | Corredor/broker. |
| `TIPO_LIQUIDACION_SALUD` | 67 | `liquidation_statuses` | Parcial | Tipo de liquidación. |
| `RECEPCION_PAGO` | 38 | `claim_payments` | Parcial | Pagos/recepción. |
| `SALUD_REPORT_CONFIG` | 29 | `report_templates` | Parcial | Configuración de reportes. |
| `web_DOCUMENTOS_OP` | 34 | `documents` | Parcial | Documentos operativos. |
| `LIQUIDACION_SALUD_DOCTOS` | 33 | `documents` | Parcial | Documentos de liquidación. |
| `SALUD_ENVIO_CONSOLA_JSON` | 2 | — | No existe | Envío de datos a consola. |

---

## Tablas eSalud no usadas (30)

Son tablas que **ningún SP referencia**. Se pueden descartar en la primera fase de migración o consolidar en otra entidad.

Ejemplos:

- `S_COBERTURAS_CIA_INT`
- `ACCESOS_LOG`
- `LIQUIDACION_SALUD_PROCESOS_ARCHIVOS`
- `wsPagos_LOG_TIEMPOS`
- `web_LOG_ASEGURADOS_ARCHIVOS`

Ver el listado completo en `docs/ESALUD_TABLE_USAGE.md`.

---

## Tablas con bajo uso (117 con 1-2 SP)

Son tablas auxiliares, logs o catálogos esporádicos. Se priorizan solo si la funcionalidad se confirma viva. Ejemplos:

- `TEMPLATE_DENUNCIO`
- `LIQUIDACION_SALUD_RECIENTES`
- `web_USUARIOS_SessionID`
- `USUARIOS_PAGINAS_RECIENTES`
- `TIPO_RESPUESTA`

---

## Revisión por módulo (basada en uso real)

| Módulo | Tablas activas en eSalud | Equivalente Health-Claims | Brecha de lógica |
|---|---|---|---|
| **Pólizas** | ~15 | `policies`, `policy_endorsements`, `policy_conditions` | Faltan árbol de coberturas, niveles, planes, corredor. |
| **Asegurados** | ~20 | `insureds`, `pre_existing_conditions`, `insured_bank_accounts` | Faltan terceros, datos extendidos, maestro de asegurados. |
| **Liquidación** | ~35 | `claims`, `claim_details`, `claim_workflow_stages`, `claim_payments` | Estados de proceso, acciones, asignación y documentos. |
| **Prestadores / Medicamentos** | ~15 | `providers`, `medications`, `pharmacies`, `laboratories` | Convenios, prestaciones N3/FGR, preferencias. |
| **Catálogos** | ~40 | `coverage_types`, `diagnostics`, `currencies`, `banks`, etc. | Muchos catálogos auxiliares no existen. |
| **Usuarios / Permisos** | ~25 | `profiles` | Módulo de acciones/subtipos/inicio de sesión no existe. |
| **Documentos / Envíos** | ~15 | `documents`, `document_templates` | Logs de envío, plantillas operativas, web. |
| **Web / Integraciones** | ~50 | — | Sin equivalente. |

---

## Conclusión ajustada

La **cantidad real de tablas a migrar no es 510, sino aproximadamente 100-150** con uso significativo. El resto son tablas muertas, logs o auxiliares esporádicos.

**Esfuerzo de migración más realista:**

1. **Fase 1 (core transaccional)**: ~30 tablas: pólizas, asegurados, liquidación, prestaciones.
2. **Fase 2 (catálogos usados)**: ~30 tablas: diagnósticos, medicamentos, bancos, tipos.
3. **Fase 3 (operación)**: ~30 tablas: documentos, estados, acciones, usuarios.
4. **Fase 4 (web/integraciones)**: ~40 tablas: recepción, pagos, reportes.

Esto reduce el alcance inicial de **510 a ~60-80 tablas críticas** en la primera versión productiva.

---

## Archivos de referencia

- `docs/ESALUD_TABLE_USAGE.md` — inventario completo de tablas y su uso por SP.
- `docs/PLAN_E_SALUD.md` — plan avanzado de migración.
- `docs/GAP_E_SALUD.md` — brecha inicial por módulo.
