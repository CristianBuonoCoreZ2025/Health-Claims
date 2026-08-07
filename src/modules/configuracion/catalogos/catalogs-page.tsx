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
  CATALOGS,
  type CatalogTable,
  buildPayload,
  getEditForm,
  getFieldLabel,
  getFieldType,
  getInitialForm,
  renderCell,
  useCatalog,
} from "@/hooks/use-catalogs";

interface CatalogManagerProps {
  table: CatalogTable;
  label?: string;
}

export function CatalogManager({ table, label }: CatalogManagerProps) {
  const catalog = CATALOGS.find((c) => c.table === table)!;
  const { items, isLoading, create, update, remove } = useCatalog(table);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, string>>(() => getInitialForm(catalog));

  const openNew = () => {
    setEditing(null);
    setForm(getInitialForm(catalog));
    setOpen(true);
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditing(row);
    setForm(getEditForm(row, catalog));
    setOpen(true);
  };

  const onSave = async () => {
    const payload = buildPayload(form, catalog);
    try {
      if (editing) {
        await update.mutateAsync({ id: String(editing.id), payload });
        toast.success("Registro actualizado");
      } else {
        await create.mutateAsync(payload);
        toast.success("Registro creado");
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
      await remove.mutateAsync(id);
      toast.success("Registro desactivado");
    } catch (err) {
      toast.error("Error al desactivar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="app-page-header">
          <h1 className="app-page-title">{label ?? catalog.label}</h1>
          <p className="app-page-lead">Gestion de {catalog.label.toLowerCase()}</p>
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
              {catalog.fieldNames.map((f) => (
                <TableHead key={f} className="app-grid-title">{getFieldLabel(f)}</TableHead>
              ))}
              <TableHead className="app-grid-title text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={catalog.fieldNames.length + 1} className="app-grid-text text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={catalog.fieldNames.length + 1} className="app-empty-state">
                  No hay registros
                </TableCell>
              </TableRow>
            )}
            {!isLoading && items.map((row) => (
              <TableRow key={String(row.id)}>
                {catalog.fieldNames.map((f) => (
                  <TableCell key={f} className="app-grid-text">{renderCell(row[f])}</TableCell>
                ))}
                <TableCell className="app-grid-text text-right">
                  <div className="flex justify-end gap-1">
                    <Button className="btn-icon-sm" size="icon" onClick={() => openEdit(row)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button className="btn-icon-sm btn-danger-hover" size="icon" onClick={() => onDelete(String(row.id))}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="modal-md" showCloseButton={false}>
          <div className="modal-header">
            <DialogTitle className="modal-title">{editing ? "Editar" : "Nuevo"} {catalog.label.toLowerCase()}</DialogTitle>
          </div>
          <div className="modal-body grid gap-4">
            {catalog.fieldNames.map((f) => {
              const t = getFieldType(f);
              if (t === "boolean") {
                return (
                  <div key={f} className="grid gap-2">
                    <Label className="app-field-label">{getFieldLabel(f)}</Label>
                    <Select value={form[f]} onValueChange={(v) => setForm((prev) => ({ ...prev, [f]: v }))}>
                      <SelectTrigger className="app-input h-7"><SelectValue /></SelectTrigger>
                      <SelectContent side="bottom" sideOffset={0} position="popper" className="z-9999">
                        <SelectItem value="true">Si</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              return (
                <div key={f} className="grid gap-2">
                  <Label className="app-field-label">{getFieldLabel(f)}</Label>
                  <Input
                    className="app-input h-7"
                    type={t === "number" ? "number" : t === "date" ? "date" : "text"}
                    placeholder={t === "array" ? "val1, val2" : ""}
                    value={form[f] ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f]: e.target.value }))}
                  />
                </div>
              );
            })}
          </div>
          <DialogFooter className="modal-footer">
            <Button className="pg-btn-platinum" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button className="pg-btn-platinum" onClick={onSave} disabled={create.isPending || update.isPending}>
              {(create.isPending || update.isPending) && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CatalogsPage() {
  const [selected, setSelected] = useState<CatalogTable>("countries");

  return (
    <div className="app-page p-6">
      <div className="app-page-header">
        <h1 className="app-page-title">Catalogos</h1>
        <p className="app-page-lead">Gestion de catalogos maestros y mapeos</p>
      </div>

      <div className="w-80">
        <Select value={selected} onValueChange={(v) => setSelected(v as CatalogTable)}>
          <SelectTrigger className="app-input h-7">
            <SelectValue placeholder="Seleccionar catalogo" />
          </SelectTrigger>
          <SelectContent side="bottom" sideOffset={0} position="popper" className="z-9999">
            {CATALOGS.map((c) => (
              <SelectItem key={c.table} value={c.table}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CatalogManager table={selected} />
    </div>
  );
}
