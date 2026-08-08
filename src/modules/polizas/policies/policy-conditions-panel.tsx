"use client";

import { useState } from "react";
import { Plus, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
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
  const { data: conditions, isLoading, isError, error, refetch } = usePolicyConditions(policyId);
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

  if (isLoading) {
    return <LoadingState context="card" className="app-card min-h-96" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error al cargar condiciones"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="app-page-lead">
          Configura topes, deducibles y copagos por tipo de cobertura
        </p>
        <Button onClick={() => setDialogOpen(true)} className="btn-primary">
          <Plus className="mr-2 size-4" />
          Anadir condicion
        </Button>
      </div>

      {(conditions ?? []).length === 0 ? (
        <div className="app-card flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
          <ShieldCheck className="size-8 opacity-40" />
          <p>No hay condiciones configuradas</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(conditions ?? []).map((cond) => (
            <div key={cond.id} className="app-card">
              <div className="flex items-start justify-between gap-2">
                <h3 className="app-card-title">{coverageName(cond.coverage_type_id)}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(cond.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="app-page-lead">Tope evento</p>
                  <p className="app-card-title mt-1">{formatCurrency(cond.event_limit)}</p>
                </div>
                <div>
                  <p className="app-page-lead">Tope anual</p>
                  <p className="app-card-title mt-1">{formatCurrency(cond.yearly_limit)}</p>
                </div>
                <div>
                  <p className="app-page-lead">Deducible</p>
                  <p className="app-card-title mt-1">
                    <Badge variant="outline">{cond.deductible_percentage}%</Badge>
                  </p>
                </div>
                <div>
                  <p className="app-page-lead">Copago</p>
                  <p className="app-card-title mt-1">
                    <Badge variant="outline">{cond.copayment_percentage}%</Badge>
                  </p>
                </div>
                <div>
                  <p className="app-page-lead">Carencia</p>
                  <p className="app-card-title mt-1">{cond.waiting_period_days} dias</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-100">
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
              {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Anadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
