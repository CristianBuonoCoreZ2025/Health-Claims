"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePolicyWithConditions } from "@/hooks/use-policies";
import { useInsuredsByPolicy } from "@/hooks/use-insureds";
import { PolicyConditionsPanel } from "./policy-conditions-panel";
import { InsuredsPanel } from "./insureds-panel";
import { formatDate, formatCurrency } from "@/utils/format";
import type { PolicyStatus } from "@/types";

const STATUS_VARIANT: Record<PolicyStatus, "default" | "secondary" | "destructive" | "outline"> = {
  vigente: "default",
  pendiente: "secondary",
  vencida: "outline",
  anulada: "destructive",
};

const STATUS_LABELS: Record<string, string> = {
  vigente: "Vigente",
  vencida: "Vencida",
  anulada: "Anulada",
  pendiente: "Pendiente",
};

export function PolicyDetailPage({ policyId }: { policyId: string }) {
  const { data: policy, isLoading } = usePolicyWithConditions(policyId);
  const insuredsQuery = useInsuredsByPolicy(policyId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex flex-col items-center gap-4 p-12">
        <p className="text-muted-foreground">Poliza no encontrada</p>
        <Button asChild variant="outline">
          <Link href="/polizas">
            <ArrowLeft className="mr-2 size-4" />
            Volver
          </Link>
        </Button>
      </div>
    );
  }

  const insureds = insuredsQuery.data ?? [];
  const conditions = policy.policy_conditions ?? [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/polizas">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Poliza {policy.policy_number}
            </h1>
            <Badge variant={STATUS_VARIANT[policy.status]}>
              {STATUS_LABELS[policy.status] ?? policy.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{policy.holder_name}</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="condiciones">
            Condiciones ({conditions.length})
          </TabsTrigger>
          <TabsTrigger value="asegurados">
            Asegurados ({insureds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard label="Numero de poliza" value={policy.policy_number} />
            <InfoCard label="Endoso" value={policy.endorsement_number} />
            <InfoCard label="Tipo de contrato" value={policy.contract_type} className="capitalize" />
            <InfoCard label="Fecha inicio" value={formatDate(policy.start_date)} />
            <InfoCard label="Fecha termino" value={formatDate(policy.end_date)} />
            <InfoCard label="Estado" value={STATUS_LABELS[policy.status] ?? policy.status} />
            <InfoCard
              label="Tope anual total"
              value={formatCurrency(
                conditions.reduce((sum, c) => sum + (c.yearly_limit ?? 0), 0)
              )}
            />
            <InfoCard
              label="Condiciones configuradas"
              value={String(conditions.length)}
            />
            <InfoCard
              label="Asegurados activos"
              value={String(insureds.filter((i) => i.is_active).length)}
            />
          </div>
        </TabsContent>

        <TabsContent value="condiciones" className="mt-4">
          <PolicyConditionsPanel policyId={policyId} />
        </TabsContent>

        <TabsContent value="asegurados" className="mt-4">
          <InsuredsPanel policyId={policyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`mt-1 font-medium ${className ?? ""}`}>{value || "-"}</p>
    </div>
  );
}
