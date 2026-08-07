"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePolicyWithConditions } from "@/hooks/use-policies";
import { useInsuredsByPolicy } from "@/hooks/use-insureds";
import { useCompanies } from "@/hooks/use-companies";
import { useContractors } from "@/hooks/use-contractors";
import { usePolicies } from "@/hooks/use-policies";
import { usePolicyEndorsementsByPolicy } from "@/hooks/use-policy-endorsements";
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
  const { data: policy, isLoading } = usePolicyWithConditions(policyId);
  const insuredsQuery = useInsuredsByPolicy(policyId);
  const endorsementsQuery = usePolicyEndorsementsByPolicy(policyId);
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
  const endorsements = endorsementsQuery.data ?? [];
  const yesNo = (v: boolean) => (v ? "Si" : "No");

  const generalFields: { label: string; value: string; className?: string }[] = [
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

  const vigenciaFields: { label: string; value: string; className?: string }[] = [
    { label: "Fecha efectiva", value: formatDate(policy.effective_date) },
    { label: "Fecha renovacion", value: formatDate(policy.renewal_date) },
    { label: "Version", value: String(policy.version) },
    { label: "Es maestra", value: yesNo(policy.is_master) },
    { label: "Poliza maestra", value: masterName },
  ];

  return (
    <div className="app-page p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/polizas">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="app-page-title">Poliza {policy.policy_number}</h1>
            <Badge variant={STATUS_VARIANT[policy.status]}>
              {STATUS_LABELS[policy.status] ?? policy.status}
            </Badge>
          </div>
          <p className="app-page-lead">{policy.holder_name}</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="vigencia">Vigencia/Permanencia</TabsTrigger>
          <TabsTrigger value="condiciones">Condiciones ({conditions.length})</TabsTrigger>
          <TabsTrigger value="arbol">Arbol de Coberturas ({treeQuery.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="asegurados">Asegurados ({insureds.length})</TabsTrigger>
          <TabsTrigger value="endosos">Endosos ({endorsements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {generalFields.map((f) => (
              <InfoCard key={f.label} label={f.label} value={f.value} className={f.className} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vigencia" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vigenciaFields.map((f) => (
              <InfoCard key={f.label} label={f.label} value={f.value} className={f.className} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="condiciones" className="mt-4">
          <PolicyConditionsPanel policyId={policyId} />
        </TabsContent>

        <TabsContent value="arbol" className="mt-4">
          <PolicyTreeView policyId={policyId} nodes={treeQuery.data ?? []} />
        </TabsContent>

        <TabsContent value="asegurados" className="mt-4">
          <InsuredsPanel policyId={policyId} />
        </TabsContent>

        <TabsContent value="endosos" className="mt-4">
          <div className="app-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endoso</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Termino</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Activo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endorsementsQuery.isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <Loader2 className="text-muted-foreground mx-auto size-5 animate-spin" />
                    </TableCell>
                  </TableRow>
                )}
                {!endorsementsQuery.isLoading && endorsements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay endosos registrados
                    </TableCell>
                  </TableRow>
                )}
                {!endorsementsQuery.isLoading &&
                  endorsements.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono font-medium">{e.endorsement_number}</TableCell>
                      <TableCell>{e.endorsement_type}</TableCell>
                      <TableCell>{formatDate(e.start_date)}</TableCell>
                      <TableCell>{formatDate(e.end_date)}</TableCell>
                      <TableCell>{e.notes ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant={e.is_active ? "default" : "outline"}>
                          {e.is_active ? "Si" : "No"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
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
