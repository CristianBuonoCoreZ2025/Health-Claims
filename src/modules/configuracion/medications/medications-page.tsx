"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Pill, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useMedications,
  useDeleteMedication,
  useSearchMedicationsByName,
  useSearchMedicationsByActiveIngredient,
} from "@/hooks/use-medications";
import { MedicationFormDialog } from "./medication-form";
import type { Medication } from "@/types";

type SearchMode = "name" | "ingredient";

export function MedicationsPage() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<SearchMode>("name");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);

  const { data: allMedications, isLoading } = useMedications();
  const nameQuery = useSearchMedicationsByName(mode === "name" ? search : "");
  const ingredientQuery = useSearchMedicationsByActiveIngredient(mode === "ingredient" ? search : "");
  const deleteMutation = useDeleteMedication();

  const medications = useMemo(() => {
    if (search.length === 0) return allMedications ?? [];
    if (mode === "name") return nameQuery.data ?? [];
    return ingredientQuery.data ?? [];
  }, [search, mode, allMedications, nameQuery.data, ingredientQuery.data]);

  const showLoading =
    search.length > 0
      ? mode === "name"
        ? nameQuery.isLoading
        : ingredientQuery.isLoading
      : isLoading;

  const handleNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (med: Medication) => {
    setEditing(med);
    setDialogOpen(true);
  };

  const handleDelete = async (med: Medication) => {
    try {
      await deleteMutation.mutateAsync(med.id);
      toast.success("Medicamento desactivado");
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
          <h1 className="text-2xl font-semibold tracking-tight">Medicamentos</h1>
          <p className="text-muted-foreground text-sm">
            Catalogo de medicamentos y farmacias
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 size-4" />
          Nuevo medicamento
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={mode === "name" ? "Buscar por nombre..." : "Buscar por principio activo..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex rounded-lg border">
          <button
            type="button"
            onClick={() => setMode("name")}
            className={
              mode === "name"
                ? "bg-primary text-primary-foreground rounded-l-lg px-3 py-1.5 text-sm"
                : "text-muted-foreground px-3 py-1.5 text-sm"
            }
          >
            Nombre
          </button>
          <button
            type="button"
            onClick={() => setMode("ingredient")}
            className={
              mode === "ingredient"
                ? "bg-primary text-primary-foreground rounded-r-lg px-3 py-1.5 text-sm"
                : "text-muted-foreground px-3 py-1.5 text-sm"
            }
          >
            Principio activo
          </button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Principio activo</TableHead>
              <TableHead>Dosis</TableHead>
              <TableHead>Laboratorio</TableHead>
              <TableHead className="w-24">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!showLoading && medications.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Pill className="size-8 opacity-40" />
                    <p>No se encontraron medicamentos</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!showLoading &&
              medications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {med.active_ingredient ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {med.dosage ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {med.laboratory ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={med.is_active ? "default" : "secondary"}>
                      {med.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(med)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(med)}
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

      <MedicationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        medication={editing}
      />
    </div>
  );
}
