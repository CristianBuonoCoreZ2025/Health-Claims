"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
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
  const [form, setForm] = useState<Record<string, string>>(() =>
    getInitialForm(catalog),
  );

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

  const title = label ?? catalog.label;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <CardAction>
            <Button onClick={openNew}>
              <Plus className="mr-2 size-4" />
              Nuevo
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && <LoadingState context="table" />}
          {!isLoading && items.length === 0 && (
            <EmptyState
              icon={<Inbox className="size-6" />}
              title="No hay registros"
              description={`Comienza creando un ${catalog.label.toLowerCase()}.`}
              action={
                <Button onClick={openNew}>
                  <Plus className="mr-2 size-4" />
                  Nuevo
                </Button>
              }
            />
          )}
          {!isLoading && items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  {catalog.fieldNames.map((f) => (
                    <TableHead key={f}>{getFieldLabel(f)}</TableHead>
                  ))}
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={String(row.id)}>
                    {catalog.fieldNames.map((f) => (
                      <TableCell key={f}>{renderCell(row[f])}</TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(row)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(String(row.id))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar" : "Nuevo"} {catalog.label.toLowerCase()}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {catalog.fieldNames.map((f) => {
              const t = getFieldType(f);
              if (t === "boolean") {
                return (
                  <div key={f} className="grid gap-2">
                    <Label>{getFieldLabel(f)}</Label>
                    <Select
                      value={form[f]}
                      onValueChange={(v) =>
                        setForm((prev) => ({ ...prev, [f]: v }))
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
                );
              }
              return (
                <div key={f} className="grid gap-2">
                  <Label>{getFieldLabel(f)}</Label>
                  <Input
                    className="h-8"
                    type={
                      t === "number" ? "number" : t === "date" ? "date" : "text"
                    }
                    placeholder={t === "array" ? "val1, val2" : ""}
                    value={form[f] ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [f]: e.target.value }))
                    }
                  />
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={onSave}
              disabled={create.isPending || update.isPending}
            >
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
      <PageHeader
        title="Catalogos"
        lead="Gestion de catalogos maestros y mapeos"
      />

      <div className="w-80">
        <Select
          value={selected}
          onValueChange={(v) => setSelected(v as CatalogTable)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Seleccionar catalogo" />
          </SelectTrigger>
          <SelectContent>
            {CATALOGS.map((c) => (
              <SelectItem key={c.table} value={c.table}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CatalogManager table={selected} />
    </div>
  );
}
