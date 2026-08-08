"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Scale } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useQuery } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCoverageTypes } from "@/hooks/use-coverage-types";
import {
  useLiquidatorWeightsByUser,
  useDeleteLiquidatorWeight,
} from "@/hooks/use-liquidator-weights";
import { WeightFormDialog } from "./weight-form";
import type { LiquidatorWeight } from "@/types";

function useLiquidadorProfiles() {
  return useQuery({
    queryKey: ["profiles", "liquidator"],
    queryFn: async () => {
      const client = createSupabaseBrowserClient();
      const { data, error } = await client
        .from("profiles")
        .select("id, full_name, role, is_active")
        .eq("role", "liquidator")
        .eq("is_active", true)
        .order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function PesosPage() {
  const { data: profiles } = useLiquidadorProfiles();
  const { data: coverageTypes } = useCoverageTypes();
  const deleteMutation = useDeleteLiquidatorWeight();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LiquidatorWeight | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const weightsQuery = useLiquidatorWeightsByUser(selectedUser);

  const liquidadores = profiles ?? [];
  const weights = weightsQuery.data ?? [];

  const handleNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (w: LiquidatorWeight) => {
    setEditing(w);
    setDialogOpen(true);
  };

  const handleDelete = async (w: LiquidatorWeight) => {
    try {
      await deleteMutation.mutateAsync(w.id);
      toast.success("Peso eliminado");
    } catch (err) {
      toast.error("Error al eliminar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const coverageName = (id: string | null) =>
    id ? coverageTypes?.find((c) => c.id === id)?.name ?? "N/A" : "General";

  const liquidadorName = (id: string) =>
    liquidadores.find((l) => l.id === id)?.full_name ?? "N/A";

  return (
    <div className="app-page">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Matriz de Peso"
          lead="Configuracion de pesos para asignacion de siniestros"
        />
        <Button onClick={handleNew}>
          <Plus className="mr-2 size-4" />
          Nuevo peso
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Liquidador:</span>
        <Button
          type="button"
          size="sm"
          variant={selectedUser === "" ? "default" : "outline"}
          onClick={() => setSelectedUser("")}
        >
          Todos
        </Button>
        {liquidadores.map((l) => (
          <Button
            key={l.id}
            type="button"
            size="sm"
            variant={selectedUser === l.id ? "default" : "outline"}
            onClick={() => setSelectedUser(l.id)}
          >
            {l.full_name || "Sin nombre"}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesos configurados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {weightsQuery.isLoading && <LoadingState context="table" />}
          {!weightsQuery.isLoading && weights.length === 0 && (
            <EmptyState
              icon={<Scale className="size-6" />}
              title="No hay pesos configurados"
              description="Agrega un nuevo peso con el boton superior."
            />
          )}
          {!weightsQuery.isLoading && weights.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Liquidador</TableHead>
                  <TableHead>Cobertura</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead className="text-right">Peso</TableHead>
                  <TableHead className="w-24">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weights.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">
                      {liquidadorName(w.user_id)}
                    </TableCell>
                    <TableCell>{coverageName(w.coverage_type_id)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {w.level}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {w.weight_value.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={w.is_active ? "default" : "secondary"}>
                        {w.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(w)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(w)}
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
          )}
        </CardContent>
      </Card>

      <WeightFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        weight={editing}
        liquidadores={liquidadores}
        coverageTypes={coverageTypes ?? []}
      />
    </div>
  );
}
