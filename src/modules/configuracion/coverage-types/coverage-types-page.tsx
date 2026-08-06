"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCoverageTypes, useDeleteCoverageType } from "@/hooks/use-coverage-types";
import { CoverageTypeFormDialog } from "./coverage-type-form";
import type { CoverageType } from "@/types";

export function CoverageTypesPage() {
  const { data: coverageTypes, isLoading } = useCoverageTypes();
  const deleteMutation = useDeleteCoverageType();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CoverageType | null>(null);

  const handleNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (ct: CoverageType) => {
    setEditing(ct);
    setDialogOpen(true);
  };

  const handleDelete = async (ct: CoverageType) => {
    try {
      await deleteMutation.mutateAsync(ct.id);
      toast.success("Tipo de cobertura desactivado");
    } catch (err) {
      toast.error("Error al desactivar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tipos de cobertura</h1>
          <p className="text-muted-foreground text-sm">
            Coberturas disponibles para asociar a prestadores
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 size-4" />
          Nuevo tipo
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead className="w-24">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (coverageTypes ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <ShieldCheck className="size-8 opacity-40" />
                    <p>No hay tipos de cobertura registrados</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              (coverageTypes ?? []).map((ct) => (
                <TableRow key={ct.id}>
                  <TableCell className="font-medium">{ct.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {ct.description ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ct.is_active ? "default" : "secondary"}>
                      {ct.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(ct)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(ct)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <CoverageTypeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coverageType={editing}
      />
    </div>
  );
}
