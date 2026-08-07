"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePolicyConditionHeaders,
  useCreatePolicyConditionHeader,
  useUpdatePolicyConditionHeader,
  useDeletePolicyConditionHeader,
} from "@/hooks/use-policy-condition-headers";
import type { PolicyConditionHeader } from "@/types";
import { ConditionLinesPanel } from "./condition-lines-panel";

interface HeaderForm {
  policy_id: string;
  endorsement_id: string;
  name: string;
  condition_type: string;
  effective_date: string;
  expiration_date: string;
  is_active: string;
}

function initialHeaderForm(): HeaderForm {
  return {
    policy_id: "",
    endorsement_id: "",
    name: "",
    condition_type: "",
    effective_date: "",
    expiration_date: "",
    is_active: "true",
  };
}

function formFromHeader(header: PolicyConditionHeader): HeaderForm {
  return {
    policy_id: header.policy_id,
    endorsement_id: header.endorsement_id ?? "",
    name: header.name,
    condition_type: header.condition_type,
    effective_date: header.effective_date,
    expiration_date: header.expiration_date ?? "",
    is_active: header.is_active ? "true" : "false",
  };
}

export function ConditionsPage() {
  const { data: headers, isLoading } = usePolicyConditionHeaders();
  const createHeader = useCreatePolicyConditionHeader();
  const updateHeader = useUpdatePolicyConditionHeader();
  const deleteHeader = useDeletePolicyConditionHeader();
  const [selectedHeaderId, setSelectedHeaderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PolicyConditionHeader | null>(null);
  const [form, setForm] = useState<HeaderForm>(initialHeaderForm);

  const openNew = () => {
    setEditing(null);
    setForm(initialHeaderForm());
    setOpen(true);
  };

  const openEdit = (header: PolicyConditionHeader) => {
    setEditing(header);
    setForm(formFromHeader(header));
    setOpen(true);
  };

  const onSave = async () => {
    const payload = {
      policy_id: form.policy_id,
      endorsement_id: form.endorsement_id || null,
      name: form.name,
      condition_type: form.condition_type,
      effective_date: form.effective_date,
      expiration_date: form.expiration_date || null,
      is_active: form.is_active === "true",
    };
    try {
      if (editing) {
        await updateHeader.mutateAsync({ id: editing.id, input: payload });
        toast.success("Cabecera actualizada");
      } else {
        await createHeader.mutateAsync(payload);
        toast.success("Cabecera creada");
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
      await deleteHeader.mutateAsync(id);
      toast.success("Cabecera desactivada");
      if (selectedHeaderId === id) setSelectedHeaderId(null);
    } catch (err) {
      toast.error("Error al desactivar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="app-page p-6">
      <div className="flex items-center justify-between">
        <div className="app-page-header">
          <h1 className="app-page-title">Condiciones de polizas</h1>
          <p className="app-page-lead">Motor de condiciones particulares N2/N5</p>
        </div>
        <Button className="pg-btn-platinum" onClick={openNew}>
          <Plus className="size-4" />
          Nuevo
        </Button>
      </div>

      <div className="app-panel overflow-x-auto">
        <Table className="app-data-table">
          <TableHeader>
            <TableRow>
              <TableHead className="app-grid-title">Nombre</TableHead>
              <TableHead className="app-grid-title">Tipo</TableHead>
              <TableHead className="app-grid-title">Vigencia</TableHead>
              <TableHead className="app-grid-title">Expiracion</TableHead>
              <TableHead className="app-grid-title">Activo</TableHead>
              <TableHead className="app-grid-title text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="app-grid-text text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (headers ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="app-empty-state">
                  No hay condiciones registradas
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              (headers ?? []).map((header) => (
                <TableRow
                  key={header.id}
                  className={selectedHeaderId === header.id ? "bg-accent/50" : undefined}
                  onClick={() => setSelectedHeaderId(header.id)}
                >
                  <TableCell className="app-grid-text">{header.name}</TableCell>
                  <TableCell className="app-grid-text">{header.condition_type}</TableCell>
                  <TableCell className="app-grid-text">{header.effective_date}</TableCell>
                  <TableCell className="app-grid-text">{header.expiration_date ?? "-"}</TableCell>
                  <TableCell className="app-grid-text">{header.is_active ? "Si" : "No"}</TableCell>
                  <TableCell className="app-grid-text text-right">
                    <div className="flex justify-end gap-1">
                      <Button className="btn-icon-sm" onClick={() => openEdit(header)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button className="btn-icon-sm btn-danger-hover" onClick={() => onDelete(header.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {selectedHeaderId && <ConditionLinesPanel headerId={selectedHeaderId} />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="modal-md" showCloseButton={false}>
          <div className="modal-header">
            <DialogTitle className="modal-title">{editing ? "Editar cabecera" : "Nueva cabecera"}</DialogTitle>
          </div>
          <div className="modal-body grid gap-4">
            <div className="grid gap-2">
              <Label className="app-field-label">ID de poliza</Label>
              <Input
                className="app-input h-7"
                value={form.policy_id}
                onChange={(e) => setForm((prev) => ({ ...prev, policy_id: e.target.value }))}
                placeholder="uuid de poliza"
              />
            </div>
            <div className="grid gap-2">
              <Label className="app-field-label">ID de endoso (opcional)</Label>
              <Input
                className="app-input h-7"
                value={form.endorsement_id}
                onChange={(e) => setForm((prev) => ({ ...prev, endorsement_id: e.target.value }))}
                placeholder="uuid de endoso"
              />
            </div>
            <div className="grid gap-2">
              <Label className="app-field-label">Nombre</Label>
              <Input
                className="app-input h-7"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label className="app-field-label">Tipo de condicion</Label>
              <Input
                className="app-input h-7"
                value={form.condition_type}
                onChange={(e) => setForm((prev) => ({ ...prev, condition_type: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label className="app-field-label">Fecha de vigencia</Label>
              <Input
                className="app-input h-7"
                type="date"
                value={form.effective_date}
                onChange={(e) => setForm((prev) => ({ ...prev, effective_date: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label className="app-field-label">Fecha de expiracion (opcional)</Label>
              <Input
                className="app-input h-7"
                type="date"
                value={form.expiration_date}
                onChange={(e) => setForm((prev) => ({ ...prev, expiration_date: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label className="app-field-label">Activo</Label>
              <Select value={form.is_active} onValueChange={(v) => setForm((prev) => ({ ...prev, is_active: v }))}>
                <SelectTrigger className="app-input h-7"><SelectValue /></SelectTrigger>
                <SelectContent side="bottom" sideOffset={0} position="popper" className="z-9999">
                  <SelectItem value="true">Si</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="modal-footer">
            <Button className="pg-btn-platinum" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button className="pg-btn-platinum" onClick={onSave} disabled={createHeader.isPending || updateHeader.isPending}>
              {(createHeader.isPending || updateHeader.isPending) && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
