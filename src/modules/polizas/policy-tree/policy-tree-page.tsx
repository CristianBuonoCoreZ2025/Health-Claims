"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePolicies } from "@/hooks/use-policies";
import { usePolicyTree } from "@/hooks/use-policy-tree";
import { PolicyTreeView } from "./policy-tree-view";

export function PolicyTreePage() {
  const { data: policies, isLoading: policiesLoading } = usePolicies();
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("");
  const treeQuery = usePolicyTree(selectedPolicyId);

  return (
    <div className="app-page p-6">
      <div className="app-page-header">
        <h1 className="app-page-title">Arbol de coberturas</h1>
        <p className="app-page-lead">
          Configura el arbol flexible de coberturas por poliza
        </p>
      </div>

      <div className="mb-6">
        <label className="app-field-label mb-2 block">Selecciona una poliza</label>
        {policiesLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="text-muted-foreground size-4 animate-spin" />
            <span className="text-muted-foreground text-sm">Cargando polizas...</span>
          </div>
        ) : (
          <Select
            value={selectedPolicyId || "none"}
            onValueChange={(v) => setSelectedPolicyId(v === "none" ? "" : v)}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecciona una poliza" />
            </SelectTrigger>
            <SelectContent side="bottom" sideOffset={0} position="popper" className="z-9999">
              <SelectItem value="none">Sin seleccion</SelectItem>
              {(policies ?? []).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.policy_number} - {p.holder_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!selectedPolicyId && (
        <div className="app-card">
          <p className="text-muted-foreground text-center text-sm">
            Selecciona una poliza para configurar su arbol de coberturas.
          </p>
        </div>
      )}

      {selectedPolicyId && (
        <>
          {treeQuery.isLoading && (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="text-muted-foreground size-6 animate-spin" />
            </div>
          )}
          {!treeQuery.isLoading && (
            <PolicyTreeView policyId={selectedPolicyId} nodes={treeQuery.data ?? []} />
          )}
        </>
      )}
    </div>
  );
}
