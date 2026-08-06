"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, ShieldCheck } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  usePolicyConditions,
  useCreatePolicyCondition,
  useDeletePolicyCondition,
} from "@/hooks/use-policy-conditions";
import { useCoverageTypes } from "@/hooks/use-coverage-types";
import { formatCurrency } from "@/utils/format";
import type { PolicyConditionInput } from "@/schemas/policy-condition.schema";

export function PolicyConditionsPanel({ policyId }: { policyId: string }) {
  const { data: conditions, isLoading } = usePolicyConditions(policyId);
  const { data: coverageTypes } = useCoverageTypes();
  const createMutation = useCreatePolicyCondition();
  const deleteMutation = useDeletePolicyCondition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCoverage, setSelectedCoverage] = useState("");

  const handleAdd = async () => {
    if (!selectedCoverage) {
      toast.error("Selecciona un tipo de cobertura");
      return;
    }
    const input: PolicyConditionInput = {
      policy_id: policyId,
      coverage_type_id: selectedCoverage,
      event_limit: 0,
      yearly_limit: 0,
      deductible_percentage: 0,
      copayment_percentage: 0,
      waiting_period_days: 0,
      is_active: true,
    };
    try {
      await createMutation.mutateAsync(input);
      toast.success("Condicion anadida");
      setDialogOpen(false);
      setSelectedCoverage("");
    } catch (err) {
      toast.error("Error al anadir", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Condicion eliminada");
    } catch (err) {
      toast.error("Error al eliminar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const coverageName = (id: string) =>
    coverageTypes?.find((c) => c.id === id)?.name ?? "N/A";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Configura topes, deducibles y copagos por tipo de cobertura
        </p>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Anadir condicion
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cobertura</TableHead>
              <TableHead className="text-right">Tope evento</TableHead>
              <TableHead className="text-right">Tope anual</TableHead>
              <TableHead className="text-right">Deducible</TableHead>
              <TableHead className="text-right">Copago</TableHead>
              <TableHead className="text-right">Carencia (dias)</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <Loader2 className="text-muted-foreground mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (conditions ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <ShieldCheck className="size-8 opacity-40" />
                    <p>No hay condiciones configuradas</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              (conditions ?? []).map((cond) => (
                <TableRow key={cond.id}>
                  <TableCell className="font-medium">
                    {coverageName(cond.coverage_type_id)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(cond.event_limit)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(cond.yearly_limit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{cond.deductible_percentage}%</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{cond.copayment_percentage}%</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {cond.waiting_period_days}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cond.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nueva condicion</DialogTitle>
            <DialogDescription>
              Selecciona el tipo de cobertura. Podras editar los valores despues.
            </DialogDescription>
          </DialogHeader>
          <Select value={selectedCoverage} onValueChange={setSelectedCoverage}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de cobertura" />
            </SelectTrigger>
            <SelectContent>
              {(coverageTypes ?? []).map((ct) => (
                <SelectItem key={ct.id} value={ct.id}>
                  {ct.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Anadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
