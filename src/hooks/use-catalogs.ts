"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { BaseRepository, queryKeys } from "@/repositories/base.repository";

export type CatalogTable =
  | "countries"
  | "regions"
  | "currencies"
  | "banks"
  | "laboratories"
  | "pharmacies"
  | "isapres"
  | "isapre_plans"
  | "vademecum"
  | "document_types"
  | "payment_methods"
  | "specialties"
  | "parent_relationships"
  | "liquidation_statuses"
  | "pending_reasons"
  | "dispatch_campaigns"
  | "company_provider_codes"
  | "company_bank_codes"
  | "company_pharmacy_codes"
  | "company_isapre_codes"
  | "company_medication_codes"
  | "holdings"
  | "contractors"
  | "company_branches"
  | "policy_endorsements"
  | "service_groups"
  | "service_subgroups"
  | "service_items"
  | "liquidator_competencies"
  | "liquidator_load_caps"
  | "liquidator_schedules"
  | "reassignment_rules"
  | "batch_downloads"
  | "report_templates"
  | "documents"
  | "document_templates"
  | "insureds"
  | "claims"
  | "claim_forms"
  | "claim_receipts"
  | "claim_dispatches"
  | "claim_payments"
  | "claim_workflow_stages";

export interface CatalogConfig {
  table: CatalogTable;
  label: string;
  fieldNames: string[];
}

export const CATALOGS: CatalogConfig[] = [
  { table: "countries", label: "Paises", fieldNames: ["code", "is_active", "name"] },
  { table: "regions", label: "Regiones", fieldNames: ["code", "country_id", "is_active", "name"] },
  { table: "currencies", label: "Monedas", fieldNames: ["code", "is_active", "name"] },
  { table: "banks", label: "Bancos", fieldNames: ["abbreviation", "code", "is_active", "name"] },
  { table: "laboratories", label: "Laboratorios", fieldNames: ["code", "is_active", "name"] },
  { table: "pharmacies", label: "Farmacias", fieldNames: ["code", "description", "is_active", "name", "provider_id"] },
  { table: "isapres", label: "Isapres", fieldNames: ["code", "description", "is_active", "name", "rut"] },
  { table: "isapre_plans", label: "Planes Isapre", fieldNames: ["code", "is_active", "isapre_id", "name"] },
  { table: "vademecum", label: "Vademecum", fieldNames: ["active_ingredient", "code", "description", "is_active", "laboratory_id", "name"] },
  { table: "document_types", label: "Tipos de documento", fieldNames: ["applies_to", "code", "is_active", "name"] },
  { table: "payment_methods", label: "Formas de pago", fieldNames: ["code", "is_active", "name"] },
  { table: "specialties", label: "Especialidades", fieldNames: ["code", "description", "is_active", "name"] },
  { table: "parent_relationships", label: "Parentescos", fieldNames: ["code", "is_active", "max_age_days", "max_age_years", "min_age_days", "min_age_years", "name"] },
  { table: "liquidation_statuses", label: "Estados de liquidacion", fieldNames: ["code", "is_active", "is_final", "name"] },
  { table: "pending_reasons", label: "Motivos de pendiente", fieldNames: ["code", "is_active", "name"] },
  { table: "dispatch_campaigns", label: "Campanas de envio", fieldNames: ["description", "dispatch_date", "is_active", "name"] },
  { table: "company_provider_codes", label: "Codigos de prestador por compania", fieldNames: ["code_1", "code_2", "company_id", "is_active", "provider_id"] },
  { table: "company_bank_codes", label: "Codigos de banco por compania", fieldNames: ["bank_id", "code", "company_id", "is_active"] },
  { table: "company_pharmacy_codes", label: "Codigos de farmacia por compania", fieldNames: ["code", "company_id", "is_active", "pharmacy_id"] },
  { table: "company_isapre_codes", label: "Codigos de isapre por compania", fieldNames: ["code", "company_id", "is_active", "isapre_id", "isapre_plan_id"] },
  { table: "company_medication_codes", label: "Codigos de medicamento por compania", fieldNames: ["code", "company_id", "is_active", "medication_id"] },
  { table: "holdings", label: "Holdings", fieldNames: ["address", "business_name", "email", "is_active", "phone", "rut"] },
  { table: "contractors", label: "Contratantes", fieldNames: ["email", "holding_id", "is_active", "name", "phone", "rut"] },
  { table: "company_branches", label: "Filiales", fieldNames: ["address", "code", "company_id", "is_active", "name"] },
  { table: "policy_endorsements", label: "Endosos", fieldNames: ["end_date", "endorsement_number", "endorsement_type", "is_active", "notes", "policy_id", "start_date", "status"] },
  { table: "service_groups", label: "Grupos de servicios", fieldNames: ["code", "description", "is_active", "name"] },
  { table: "service_subgroups", label: "Subgrupos de servicios", fieldNames: ["code", "description", "is_active", "name", "service_group_id"] },
  { table: "service_items", label: "Prestaciones", fieldNames: ["code", "description", "is_active", "name", "service_subgroup_id", "specialty_id"] },
  { table: "liquidator_competencies", label: "Competencias de liquidadores", fieldNames: ["user_id", "service_group_id", "level", "is_active"] },
  { table: "liquidator_load_caps", label: "Topes de carga", fieldNames: ["user_id", "max_active_claims", "company_id", "coverage_type_id", "is_active"] },
  { table: "liquidator_schedules", label: "Horarios de liquidadores", fieldNames: ["user_id", "day_of_week", "start_time", "end_time", "is_active"] },
  { table: "reassignment_rules", label: "Reglas de reasignacion", fieldNames: ["name", "from_user_id", "to_user_id", "coverage_type_id", "company_id", "priority", "is_active"] },
  { table: "batch_downloads", label: "Descargas masivas", fieldNames: ["user_id", "entity_type", "status", "file_path", "started_at", "completed_at"] },
  { table: "report_templates", label: "Plantillas de reportes", fieldNames: ["name", "template_type", "applies_to", "file_path", "is_active"] },
  { table: "documents", label: "Documentos", fieldNames: ["entity_type", "entity_id", "document_type_id", "file_path", "status", "uploaded_by"] },
  { table: "document_templates", label: "Plantillas de documentos", fieldNames: ["name", "document_type_id", "template_type", "file_path", "is_active"] },
  { table: "insureds", label: "Asegurados", fieldNames: ["policy_id", "rut", "first_name", "last_name", "birth_date", "gender", "relationship", "is_titular", "is_active"] },
  { table: "claims", label: "Siniestros", fieldNames: ["policy_id", "insured_id", "claim_number", "incident_date", "report_date", "status", "amount_requested", "assigned_liquidator_id"] },
  { table: "claim_forms", label: "Formularios de siniestro", fieldNames: ["claim_id", "form_number", "received_by", "received_at"] },
  { table: "claim_receipts", label: "Recepcion de siniestro", fieldNames: ["claim_id", "document_type_id", "receipt_number", "received_at", "verified", "notes"] },
  { table: "claim_dispatches", label: "Despachos de siniestro", fieldNames: ["claim_id", "remittance_number", "dispatch_date", "carrier", "tracking_code"] },
  { table: "claim_payments", label: "Pagos de siniestro", fieldNames: ["claim_id", "amount", "payment_date", "payment_method_id", "currency_id", "reference", "status"] },
  { table: "claim_workflow_stages", label: "Etapas de workflow", fieldNames: ["claim_id", "stage", "action_type", "sla_minutes", "started_at", "completed_at", "completed_by", "comments"] },
];

const FIELD_LABELS: Record<string, string> = {
  code: "codigo", name: "nombre", rut: "RUT", description: "descripcion", abbreviation: "abreviatura",
  active_ingredient: "principio activo", applies_to: "aplica a", is_active: "activo", is_final: "es final",
  min_age_years: "edad minima (anos)", min_age_days: "edad minima (dias)",
  max_age_years: "edad maxima (anos)", max_age_days: "edad maxima (dias)",
  dispatch_date: "fecha de envio", code_1: "codigo 1", code_2: "codigo 2",
  country_id: "pais", region_id: "region", currency_id: "moneda", bank_id: "banco",
  laboratory_id: "laboratorio", pharmacy_id: "farmacia", isapre_id: "isapre",
  isapre_plan_id: "plan de isapre", vademecum_id: "vademecum", provider_id: "prestador",
  company_id: "compania", medication_id: "medicamento", specialty_id: "especialidad",
  service_group_id: "grupo de servicios", service_subgroup_id: "subgrupo de servicios",
  holding_id: "holding", contractor_id: "contratante", policy_id: "poliza",
  business_name: "razon social", address: "direccion", phone: "telefono", email: "email",
  endorsement_number: "numero de endoso", endorsement_type: "tipo de endoso",
  start_date: "fecha inicio", end_date: "fecha termino", status: "estado", notes: "notas",
  user_id: "usuario", from_user_id: "usuario origen", to_user_id: "usuario destino",
  document_type_id: "tipo de documento", template_type: "tipo de plantilla", file_path: "ruta de archivo",
  entity_type: "tipo de entidad", entity_id: "id de entidad", uploaded_by: "subido por",
  started_at: "iniciado", completed_at: "completado", day_of_week: "dia de la semana",
  start_time: "hora inicio", end_time: "hora termino", max_active_claims: "maximo siniestros activos",
  priority: "prioridad", level: "nivel", weight_value: "valor de peso",
  first_name: "nombres", last_name: "apellidos", birth_date: "fecha nacimiento",
  gender: "genero", relationship: "parentesco", is_titular: "titular",
  claim_number: "numero siniestro", incident_date: "fecha incidente", report_date: "fecha denuncio",
  amount_requested: "monto solicitado", assigned_liquidator_id: "liquidador asignado",
  form_number: "numero formulario", received_by: "recibido por", received_at: "recibido el",
  receipt_number: "numero comprobante", verified: "verificado",
  remittance_number: "numero remesa", carrier: "transporte", tracking_code: "codigo seguimiento",
  amount: "monto", payment_date: "fecha pago", payment_method_id: "metodo pago", reference: "referencia",
  action_type: "tipo accion", sla_minutes: "SLA minutos", completed_by: "completado por", comments: "comentarios",
  insured_id: "asegurado",
};

export function getFieldType(name: string) {
  if (name.startsWith("is_") || name === "verified") return "boolean";
  if (name === "applies_to") return "array";
  if (name.endsWith("_id")) return "uuid";
  if (name.startsWith("min_age") || name.startsWith("max_age")) return "number";
  if (name.endsWith("_date")) return "date";
  if (name.endsWith("_at")) return "datetime";
  if (
    name === "level" ||
    name === "priority" ||
    name === "day_of_week" ||
    name === "max_active_claims" ||
    name === "weight_value" ||
    name === "amount" ||
    name === "amount_requested" ||
    name === "sla_minutes"
  ) return "number";
  return "string";
}

export const getFieldLabel = (name: string) => FIELD_LABELS[name] ?? name.replace(/_/g, " ");

export function useCatalog(table: CatalogTable) {
  const client = createSupabaseBrowserClient();
  const repo = useMemo(() => new BaseRepository(table, client), [table, client]);
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: queryKeys.tableList(table, { active: true }),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      const rows = (data ?? []) as Record<string, unknown>[];
      return rows.filter((r) => r.is_active === true || r.is_active === undefined);
    },
  });
  const create = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data, error } = await repo.insert(payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.table(table) });
    },
  });
  const update = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const { data, error } = await repo.update(id, payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.table(table) });
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.table(table) });
    },
  });
  return { items: list.data ?? [], isLoading: list.isLoading, create, update, remove };
}

export function renderCell(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Si" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "-";
}

export function getInitialForm(catalog: CatalogConfig) {
  const out: Record<string, string> = {};
  for (const field of catalog.fieldNames) {
    const t = getFieldType(field);
    if (t === "boolean") out[field] = field === "is_active" ? "true" : "false";
    else out[field] = "";
  }
  return out;
}

export function getEditForm(row: Record<string, unknown>, catalog: CatalogConfig) {
  const out: Record<string, string> = {};
  for (const field of catalog.fieldNames) {
    const v = row[field];
    const t = getFieldType(field);
    if (t === "boolean") out[field] = v === true ? "true" : "false";
    else if (t === "array") out[field] = Array.isArray(v) ? v.join(", ") : "";
    else if (typeof v === "string" || typeof v === "number") out[field] = String(v);
    else out[field] = "";
  }
  return out;
}

export function buildPayload(
  form: Record<string, string>,
  catalog: CatalogConfig
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const field of catalog.fieldNames) {
    const raw = form[field] ?? "";
    const t = getFieldType(field);
    if (raw === "" && t !== "boolean") continue;
    if (t === "boolean") payload[field] = raw === "true";
    else if (t === "number") payload[field] = Number(raw);
    else if (t === "array") payload[field] = raw.split(",").map((s) => s.trim()).filter(Boolean);
    else payload[field] = raw;
  }
  return payload;
}
