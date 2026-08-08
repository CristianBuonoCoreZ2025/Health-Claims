"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConditionsByNode, useDeleteTreeCondition } from "@/hooks/use-policy-tree";
import { formatCurrency } from "@/utils/format";
import type { PolicyTreeCondition } from "@/types";
import { TreeConditionForm } from "./tree-condition-form";

interface TreeConditionListProps {
  policyId: string;
  nodeId: string;
  nodeName: string;
}

export function TreeConditionList({ policyId, nodeId, nodeName }: TreeConditionListProps) {
  const { data: conditions, isLoading } = useConditionsByNode(nodeId);
  const deleteMutation = useDeleteTreeCondition(policyId);
  const [showForm, setShowForm] = useState(false);
  const [editingCondition, setEditingCondition] = useState<PolicyTreeCondition | null>(null);

  const handleAdd = () => {
    setEditingCondition(null);
    setShowForm(true);
  };

  const handleEdit = (condition: PolicyTreeCondition) => {
    setEditingCondition(condition);
    setShowForm(true);
  };

  const handleDelete = async (condition: PolicyTreeCondition) => {
    try {
      await deleteMutation.mutateAsync(condition.id);
      toast.success("Condicion eliminada");
    } catch (err) {
      toast.error("Error al eliminar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="app-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="app-card-title">Condiciones del nodo</h4>
          <p className="text-muted-foreground text-sm">{nodeName}</p>
        </div>
        <Button type="button" variant="outline" onClick={handleAdd}>
          <Plus className="mr-1 size-4" />
          Agregar
        </Button>
      </div>

      {isLoading && (
        <p className="text-muted-foreground text-sm">Cargando condiciones...</p>
      )}

      {!isLoading && (!conditions || conditions.length === 0) && (
        <p className="text-muted-foreground text-sm">
          No hay condiciones configuradas para este nodo.
        </p>
      )}

      {!isLoading && conditions && conditions.length > 0 && (
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div
              key={condition.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {condition.condition_type}
                  </Badge>
                  <span className="text-sm font-medium">{condition.name}</span>
                  {!condition.is_active && (
                    <Badge variant="outline" className="text-xs">Inactiva</Badge>
                  )}
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {condition.yearly_limit != null && (
                    <span>Tope anual: {formatCurrency(condition.yearly_limit)}</span>
                  )}
                  {condition.per_event_limit != null && (
                    <span>Tope evento: {formatCurrency(condition.per_event_limit)}</span>
                  )}
                  {condition.deductible_percentage != null && (
                    <span>Deducible: {condition.deductible_percentage}%</span>
                  )}
                  {condition.copay_percentage != null && (
                    <span>Copago: {condition.copay_percentage}%</span>
                  )}
                  {condition.waiting_period_days != null && (
                    <span>Carencia: {condition.waiting_period_days} dias</span>
                  )}
                  {condition.frequency && (
                    <span>Frecuencia: {condition.frequency}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => handleEdit(condition)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(condition)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TreeConditionForm
          policyId={policyId}
          nodeId={nodeId}
          condition={editingCondition}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
