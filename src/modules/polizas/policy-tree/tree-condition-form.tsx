"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { policyTreeConditionSchema, type PolicyTreeConditionInput } from "@/schemas/policy-tree.schema";
import { useCreateTreeCondition, useUpdateTreeCondition } from "@/hooks/use-policy-tree";
import type { PolicyTreeCondition } from "@/types";

const CONDITION_TYPES = ["limite", "deducible", "copago", "carencia", "regla", "combinada"];

interface TreeConditionFormProps {
  policyId: string;
  nodeId: string;
  condition?: PolicyTreeCondition | null;
  onClose: () => void;
}

function getDefaultValues(
  nodeId: string,
  condition?: PolicyTreeCondition | null
): PolicyTreeConditionInput {
  return {
    node_id: nodeId,
    condition_type: condition?.condition_type ?? "",
    name: condition?.name ?? "",
    yearly_limit: condition?.yearly_limit ?? null,
    per_event_limit: condition?.per_event_limit ?? null,
    lifetime_limit: condition?.lifetime_limit ?? null,
    deductible_amount: condition?.deductible_amount ?? null,
    deductible_percentage: condition?.deductible_percentage ?? null,
    copay_percentage: condition?.copay_percentage ?? null,
    waiting_period_days: condition?.waiting_period_days ?? null,
    currency_id: condition?.currency_id ?? null,
    frequency: condition?.frequency ?? null,
    effective_date: condition?.effective_date ?? null,
    end_date: condition?.end_date ?? null,
    rules: null,
    is_active: condition?.is_active ?? true,
  };
}

function NumberFormField({
  control,
  name,
  label,
}: {
  control: ReturnType<typeof useForm<PolicyTreeConditionInput>>["control"];
  name: keyof PolicyTreeConditionInput;
  label: string;
}) {
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
              value={typeof field.value === "number" ? String(field.value) : ""}
              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TreeConditionForm({ policyId, nodeId, condition, onClose }: TreeConditionFormProps) {
  const isEdit = Boolean(condition);
  const createMutation = useCreateTreeCondition(policyId);
  const updateMutation = useUpdateTreeCondition(policyId);

  const form = useForm<PolicyTreeConditionInput>({
    resolver: zodResolver(policyTreeConditionSchema),
    defaultValues: getDefaultValues(nodeId, condition),
  });

  useEffect(() => {
    form.reset(getDefaultValues(nodeId, condition));
  }, [nodeId, condition, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (isEdit && condition) {
        await updateMutation.mutateAsync({ id: condition.id, input: values });
        toast.success("Condicion actualizada");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Condicion creada");
      }
      onClose();
      form.reset();
    } catch (err) {
      toast.error("Error al guardar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="modal-lg">
        <DialogHeader className="modal-header">
          <DialogTitle className="modal-title">
            {isEdit ? "Editar condicion" : "Nueva condicion"}
          </DialogTitle>
          <DialogDescription>
            Configura las condiciones del nodo seleccionado.
          </DialogDescription>
        </DialogHeader>
        <div className="modal-body">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="condition_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={typeof field.value === "string" ? field.value : ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent side="bottom" sideOffset={0} position="popper" className="z-9999">
                          {CONDITION_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Nombre</FormLabel>
                      <FormControl>
                        <Input className="app-input" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <NumberFormField control={form.control} name="yearly_limit" label="Tope anual" />
                <NumberFormField control={form.control} name="per_event_limit" label="Tope evento" />
                <NumberFormField control={form.control} name="lifetime_limit" label="Tope vitalicio" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <NumberFormField control={form.control} name="deductible_amount" label="Deducible monto" />
                <NumberFormField control={form.control} name="deductible_percentage" label="Deducible %" />
                <NumberFormField control={form.control} name="copay_percentage" label="Copago %" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <NumberFormField control={form.control} name="waiting_period_days" label="Carencia (dias)" />
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Frecuencia</FormLabel>
                      <FormControl>
                        <Input
                          className="app-input"
                          value={typeof field.value === "string" ? field.value : ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Moneda</FormLabel>
                      <FormControl>
                        <Input
                          className="app-input"
                          value={typeof field.value === "string" ? field.value : ""}
                          onChange={field.onChange}
                          placeholder="UUID de moneda"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="effective_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Fecha inicio</FormLabel>
                      <FormControl>
                        <Input className="app-input" type="date" value={typeof field.value === "string" ? field.value : ""} onChange={(e) => field.onChange(e.target.value || null)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Fecha termino</FormLabel>
                      <FormControl>
                        <Input className="app-input" type="date" value={typeof field.value === "string" ? field.value : ""} onChange={(e) => field.onChange(e.target.value || null)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="app-field-label m-0">Activa</FormLabel>
                    <FormControl>
                      <Switch checked={field.value === true} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="modal-footer">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cerrar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
