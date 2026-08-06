"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Scale, Loader2 } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCoverageTypes } from "@/hooks/use-coverage-types";
import {
  useLiquidatorWeightsByUser,
  useDeleteLiquidatorWeight,
} from "@/hooks/use-liquidator-weights";
import { WeightFormDialog } from "./weight-form";
import type { LiquidatorWeight } from "@/types";

// Hook temporal para listar perfiles liquidadores.
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

  // Cargar pesos del usuario seleccionado (o todos si no hay seleccion).
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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matriz de Peso</h1>
          <p className="text-muted-foreground text-sm">
            Configuracion de pesos para asignacion de siniestros
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 size-4" />
          Nuevo peso
        </Button>
      </div>

      {/* Selector de liquidador */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Liquidador:</span>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setSelectedUser("")}
            className={
              selectedUser === ""
                ? "bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-sm"
                : "text-muted-foreground rounded-lg border px-3 py-1.5 text-sm"
            }
          >
            Todos
          </button>
          {liquidadores.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelectedUser(l.id)}
              className={
                selectedUser === l.id
                  ? "bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-sm"
                  : "text-muted-foreground rounded-lg border px-3 py-1.5 text-sm"
              }
            >
              {l.full_name || "Sin nombre"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border">
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
            {weightsQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!weightsQuery.isLoading && weights.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Scale className="size-8 opacity-40" />
                    <p>No hay pesos configurados</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!weightsQuery.isLoading &&
              weights.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">
                    {liquidadorName(w.user_id)}
                  </TableCell>
                  <TableCell>{coverageName(w.coverage_type_id)}</TableCell>
                  <TableCell className="text-muted-foreground">{w.level}</TableCell>
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
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(w)}>
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
      </div>

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
