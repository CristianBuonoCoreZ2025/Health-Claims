"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
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
  const { data: coverageTypes, isLoading, isError, error, refetch } = useCoverageTypes();
  const deleteMutation = useDeleteCoverageType();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CoverageType | null>(null);

  if (isError) {
    return (
      <div className="app-page">
        <PageHeader title="Tipos de cobertura" lead="Coberturas disponibles para asociar a prestadores" />
        <ErrorState
          title="Error al cargar tipos de cobertura"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

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
    <div className="app-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Tipos de cobertura" lead="Coberturas disponibles para asociar a prestadores" />
        <Button onClick={handleNew}>
          <Plus className="size-4" />
          Nuevo tipo
        </Button>
      </div>

      {isLoading && <LoadingState context="table" className="app-card" />}

      {!isLoading && (
        <div className="app-card overflow-hidden">
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
              {(coverageTypes ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <EmptyState
                      icon={<ShieldCheck className="size-8 opacity-40" />}
                      title="No hay tipos de cobertura registrados"
                    />
                  </TableCell>
                </TableRow>
              ) : (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <CoverageTypeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coverageType={editing}
      />
    </div>
  );
}
