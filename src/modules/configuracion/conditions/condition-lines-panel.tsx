"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  usePolicyConditionLines,
  useCreatePolicyConditionLine,
  useUpdatePolicyConditionLine,
  useDeletePolicyConditionLine,
} from "@/hooks/use-policy-condition-lines";
import type { PolicyConditionLine } from "@/types";

interface LineForm {
  classification: string;
  status: string;
  branch: string;
  premium: string;
  preferential_provider: string;
  is_active: string;
}

function initialLineForm(): LineForm {
  return {
    classification: "",
    status: "",
    branch: "",
    premium: "",
    preferential_provider: "false",
    is_active: "true",
  };
}

function formFromLine(line: PolicyConditionLine): LineForm {
  return {
    classification: line.classification ?? "",
    status: line.status ?? "",
    branch: line.branch ?? "",
    premium: line.premium != null ? String(line.premium) : "",
    preferential_provider: line.preferential_provider ? "true" : "false",
    is_active: line.is_active ? "true" : "false",
  };
}

function numberOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isNaN(n) ? null : n;
}

interface ConditionLinesPanelProps {
  headerId: string;
}

export function ConditionLinesPanel({ headerId }: ConditionLinesPanelProps) {
  const { data: lines, isLoading } = usePolicyConditionLines(headerId);
  const createLine = useCreatePolicyConditionLine();
  const updateLine = useUpdatePolicyConditionLine();
  const deleteLine = useDeletePolicyConditionLine();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PolicyConditionLine | null>(null);
  const [form, setForm] = useState<LineForm>(initialLineForm);

  const openNew = () => {
    setEditing(null);
    setForm(initialLineForm());
    setOpen(true);
  };

  const openEdit = (line: PolicyConditionLine) => {
    setEditing(line);
    setForm(formFromLine(line));
    setOpen(true);
  };

  const onSave = async () => {
    const payload = {
      policy_condition_header_id: headerId,
      classification: form.classification || null,
      status: form.status || null,
      branch: form.branch || null,
      premium: numberOrNull(form.premium),
      preferential_provider: form.preferential_provider === "true",
      is_active: form.is_active === "true",
    };
    try {
      if (editing) {
        await updateLine.mutateAsync({ id: editing.id, input: payload });
        toast.success("Linea actualizada");
      } else {
        await createLine.mutateAsync(payload);
        toast.success("Linea creada");
      }
      setOpen(false);
    } catch (err) {
      toast.error("Error al guardar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteLine.mutateAsync(id);
      toast.success("Linea desactivada");
    } catch (err) {
      toast.error("Error al desactivar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Lineas de condicion</CardTitle>
        <CardAction>
          <Button onClick={openNew}>
            <Plus className="size-4" />
            Nueva linea
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && <LoadingState context="table" />}
        {!isLoading && (lines ?? []).length === 0 && (
          <EmptyState title="No hay lineas registradas" />
        )}
        {!isLoading && (lines ?? []).length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clasificacion</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ramo</TableHead>
                  <TableHead>Prima</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(lines ?? []).map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">{line.classification ?? "-"}</TableCell>
                    <TableCell>{line.status ?? "-"}</TableCell>
                    <TableCell>{line.branch ?? "-"}</TableCell>
                    <TableCell>{line.premium != null ? String(line.premium) : "-"}</TableCell>
                    <TableCell>{line.is_active ? "Si" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(line)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(line.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar linea" : "Nueva linea"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              { key: "classification" as const, label: "Clasificacion" },
              { key: "status" as const, label: "Estado" },
              { key: "branch" as const, label: "Ramo" },
            ].map((field) => (
              <div key={field.key} className="grid gap-2">
                <Label>{field.label}</Label>
                <Input
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="grid gap-2">
              <Label>Prima</Label>
              <Input
                type="number"
                step="0.01"
                value={form.premium}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, premium: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Proveedor preferencial</Label>
              <Select
                value={form.preferential_provider}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, preferential_provider: v }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Si</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Activo</Label>
              <Select
                value={form.is_active}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, is_active: v }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Si</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave} disabled={createLine.isPending || updateLine.isPending}>
              {(createLine.isPending || updateLine.isPending) && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
