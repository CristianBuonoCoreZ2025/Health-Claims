"use client";

import { useFormContext } from "react-hook-form";
import type { Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { PolicyInput } from "@/schemas/policy.schema";
import type { Broker, Company, CompanyBranch, Contractor, Policy } from "@/types";

interface PolicyFormFieldsProps {
  companies: Company[];
  contractors: Contractor[];
  masters: Policy[];
  brokers: Broker[];
  branches: CompanyBranch[];
}

const STATUS_LABELS: Record<string, string> = {
  vigente: "Vigente",
  vencida: "Vencida",
  anulada: "Anulada",
  pendiente: "Pendiente",
};

function TextField({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: Path<PolicyInput>;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  const { control } = useFormContext<PolicyInput>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="app-field-label">{label}</FormLabel>
          <FormControl>
            <Input
              className="app-input"
              type={type}
              placeholder={placeholder}
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DateField({ name, label }: { name: Path<PolicyInput>; label: string }) {
  const { control } = useFormContext<PolicyInput>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="app-field-label">{label}</FormLabel>
          <FormControl>
            <Input
              className="app-input"
              type="date"
              value={typeof field.value === "string" ? field.value : ""}
              onChange={(e) => field.onChange(e.target.value || null)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NumberField({
  name,
  label,
  min,
}: {
  name: Path<PolicyInput>;
  label: string;
  min?: number;
}) {
  const { control } = useFormContext<PolicyInput>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="app-field-label">{label}</FormLabel>
          <FormControl>
            <Input
              className="app-input"
              type="number"
              min={min}
              value={typeof field.value === "number" ? field.value : 1}
              onChange={(e) => {
                const v = Number(e.target.value);
                field.onChange(Number.isNaN(v) ? 1 : v);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SelectField({
  name,
  label,
  placeholder,
  optional,
  noneLabel,
  children,
}: {
  name: Path<PolicyInput>;
  label: string;
  placeholder: string;
  optional?: boolean;
  noneLabel?: string;
  children: React.ReactNode;
}) {
  const { control } = useFormContext<PolicyInput>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="app-field-label">{label}</FormLabel>
          <Select
            onValueChange={(v) => field.onChange(v === "none" ? null : v)}
            value={typeof field.value === "string" ? field.value : optional ? "none" : ""}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent side="bottom" sideOffset={0} position="popper" className="z-9999">
              {optional && <SelectItem value="none">{noneLabel}</SelectItem>}
              {children}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SwitchField({ name, label }: { name: Path<PolicyInput>; label: string }) {
  const { control } = useFormContext<PolicyInput>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-lg border p-3">
          <FormLabel className="app-field-label m-0">{label}</FormLabel>
          <FormControl>
            <Switch checked={field.value === true} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function PolicyFormFields({
  companies,
  contractors,
  masters,
  brokers,
  branches,
}: PolicyFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <SelectField name="company_id" label="Compania" placeholder="Selecciona compania">
          {companies.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectField>
        <SelectField
          name="contractor_id"
          label="Contratista"
          placeholder="Selecciona contratista"
          optional
          noneLabel="Sin contratista"
        >
          {contractors.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          name="broker_id"
          label="Corredor"
          placeholder="Selecciona corredor"
          optional
          noneLabel="Sin corredor"
        >
          {brokers.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
        </SelectField>
        <SelectField
          name="branch_id"
          label="Filiales"
          placeholder="Selecciona filial"
          optional
          noneLabel="Sin filial"
        >
          {branches.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
        </SelectField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="sponsor" label="Patrocinador" placeholder="Patrocinador" />
        <TextField name="policy_type" label="Tipo de poliza" placeholder="Tipo de poliza" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="policy_number" label="Numero de poliza" placeholder="POL-001" />
        <TextField name="endorsement_number" label="Endoso" placeholder="0" />
      </div>

      <TextField name="holder_name" label="Titular del contrato" placeholder="Empresa ABC" />

      <div className="grid grid-cols-2 gap-4">
        <DateField name="start_date" label="Fecha inicio" />
        <DateField name="end_date" label="Fecha termino" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DateField name="effective_date" label="Fecha efectiva" />
        <DateField name="renewal_date" label="Fecha renovacion" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField name="contract_type" label="Tipo de contrato" placeholder="Selecciona tipo">
          <SelectItem value="individual">Individual</SelectItem>
          <SelectItem value="colectivo">Colectivo</SelectItem>
        </SelectField>
        <SelectField name="status" label="Estado" placeholder="Selecciona estado">
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberField name="version" label="Version" min={1} />
        <SelectField
          name="master_policy_id"
          label="Poliza maestra"
          placeholder="Selecciona poliza maestra"
          optional
          noneLabel="Sin poliza maestra"
        >
          {masters.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.policy_number} - {p.holder_name}
            </SelectItem>
          ))}
        </SelectField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SwitchField name="is_master" label="Es poliza maestra" />
        <SwitchField name="is_active" label="Activa" />
      </div>
    </div>
  );
}
