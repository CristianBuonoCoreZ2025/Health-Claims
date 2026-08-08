"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePolicyWithConditions } from "@/hooks/use-policies";
import { useInsuredsByPolicy } from "@/hooks/use-insureds";
import { useCompanies } from "@/hooks/use-companies";
import { useContractors } from "@/hooks/use-contractors";
import { usePolicies } from "@/hooks/use-policies";
import { useBrokers } from "@/hooks/use-brokers";
import { useCompanyBranches } from "@/hooks/use-company-branches";
import { usePolicyTree } from "@/hooks/use-policy-tree";
import { PolicyConditionsPanel } from "./policy-conditions-panel";
import { InsuredsPanel } from "./insureds-panel";
import { PolicyTreeView } from "@/modules/polizas/policy-tree/policy-tree-view";
import { formatDate, formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
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
  const { data: policy, isLoading, isError, error, refetch } = usePolicyWithConditions(policyId);
  const insuredsQuery = useInsuredsByPolicy(policyId);
  const { data: companies } = useCompanies();
  const { data: contractors } = useContractors();
  const { data: allPolicies } = usePolicies();
  const { data: brokers } = useBrokers();
  const { data: branches } = useCompanyBranches();
  const treeQuery = usePolicyTree(policyId);

  const companyName = companies?.find((c) => c.id === policy?.company_id)?.name ?? policy?.company_id ?? "-";
  const contractorName = contractors?.find((c) => c.id === policy?.contractor_id)?.name ?? policy?.contractor_id ?? "-";
  const brokerName = brokers?.find((b) => b.id === policy?.broker_id)?.name ?? "-";
  const branchName = branches?.find((b) => b.id === policy?.branch_id)?.name ?? "-";
  const masterPolicy = allPolicies?.find((p) => p.id === policy?.master_policy_id);
  const masterName = masterPolicy
    ? `${masterPolicy.policy_number} - ${masterPolicy.holder_name}`
    : "-";

  if (isLoading) {
    return <LoadingState context="card" className="app-card min-h-96" />;
  }

  if (isError || !policy) {
    return (
      <div className="app-page">
        <ErrorState
          title={isError ? "Error al cargar la poliza" : "Poliza no encontrada"}
          description={error instanceof Error ? error.message : undefined}
          onRetry={isError ? () => refetch() : undefined}
        />
      </div>
    );
  }

  const insureds = insuredsQuery.data ?? [];
  const conditions = policy.policy_conditions ?? [];
  const yesNo = (v: boolean) => (v ? "Si" : "No");

  const fields = [
    { label: "Numero de poliza", value: policy.policy_number },
    { label: "Endoso", value: policy.endorsement_number },
    { label: "Titular", value: policy.holder_name },
    { label: "Compania", value: companyName },
    { label: "Contratista", value: contractorName },
    { label: "Corredor", value: brokerName },
    { label: "Filiales", value: branchName },
    { label: "Patrocinador", value: policy.sponsor ?? "-" },
    { label: "Tipo de poliza", value: policy.policy_type ?? "-" },
    { label: "Tipo de contrato", value: policy.contract_type, className: "capitalize" },
    { label: "Estado", value: STATUS_LABELS[policy.status] ?? policy.status },
    { label: "Fecha inicio", value: formatDate(policy.start_date) },
    { label: "Fecha termino", value: formatDate(policy.end_date) },
    { label: "Fecha efectiva", value: formatDate(policy.effective_date) },
    { label: "Fecha renovacion", value: formatDate(policy.renewal_date) },
    { label: "Version", value: String(policy.version) },
    { label: "Es maestra", value: yesNo(policy.is_master) },
    { label: "Poliza maestra", value: masterName },
    { label: "Activa", value: yesNo(policy.is_active) },
    { label: "Tope anual total", value: formatCurrency(conditions.reduce((sum, c) => sum + (c.yearly_limit ?? 0), 0)) },
    { label: "Condiciones configuradas", value: String(conditions.length) },
    { label: "Asegurados activos", value: String(insureds.filter((i) => i.is_active).length) },
  ];

  return (
    <div className="app-page">
      <div className="flex items-start gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/polizas">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <PageHeader
          title={`Poliza ${policy.policy_number}`}
          lead={policy.holder_name}
          className="flex-1"
        />
        <Badge variant={STATUS_VARIANT[policy.status]}>
          {STATUS_LABELS[policy.status] ?? policy.status}
        </Badge>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="condiciones">Condiciones ({conditions.length})</TabsTrigger>
          <TabsTrigger value="asegurados">Asegurados ({insureds.length})</TabsTrigger>
          <TabsTrigger value="arbol">Arbol ({treeQuery.data?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {fields.map((f) => (
              <InfoCard key={f.label} label={f.label} value={f.value} className={f.className} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="condiciones" className="mt-4">
          <PolicyConditionsPanel policyId={policyId} />
        </TabsContent>

        <TabsContent value="asegurados" className="mt-4">
          <InsuredsPanel policyId={policyId} />
        </TabsContent>

        <TabsContent value="arbol" className="mt-4">
          <PolicyTreeView policyId={policyId} nodes={treeQuery.data ?? []} />
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
    <div className="app-card">
      <p className="app-page-lead">{label}</p>
      <p className={cn("app-card-title mt-1", className)}>{value || "-"}</p>
    </div>
  );
}
