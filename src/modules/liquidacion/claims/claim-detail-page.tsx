"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  FileQuestion,
  Loader2,
  Calculator,
  FileText,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClaimWithRelations, useUpdateClaim } from "@/hooks/use-claims";
import { useClaimTimeline, useCreateTimelineEntry } from "@/hooks/use-claim-timeline";
import { formatDate, formatCurrency } from "@/utils/format";
import type { ClaimStatus } from "@/types";

const STATUS_VARIANT: Record<ClaimStatus, "default" | "secondary" | "destructive" | "outline"> = {
  ingresado: "secondary",
  asignado: "secondary",
  en_revision: "default",
  solicitando_antecedentes: "outline",
  aprobado: "default",
  rechazado: "destructive",
  pagado: "default",
};

const STATUS_LABELS: Record<string, string> = {
  ingresado: "Ingresado",
  asignado: "Asignado",
  en_revision: "En revision",
  solicitando_antecedentes: "Solicitando antecedentes",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  pagado: "Pagado",
};

export function ClaimDetailPage({ claimId }: { claimId: string }) {
  const { data: claim, isLoading } = useClaimWithRelations(claimId);
  const { data: timeline } = useClaimTimeline(claimId);
  const updateMutation = useUpdateClaim();
  const timelineMutation = useCreateTimelineEntry();

  const [actionDialog, setActionDialog] = useState<null | "approve" | "reject" | "request">(null);
  const [actionReason, setActionReason] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex flex-col items-center gap-4 p-12">
        <p className="text-muted-foreground">Siniestro no encontrado</p>
        <Button asChild variant="outline">
          <Link href="/liquidacion">
            <ArrowLeft className="mr-2 size-4" />
            Volver
          </Link>
        </Button>
      </div>
    );
  }

  const policy = claim.policies;
  const insured = claim.insureds;
  const details = claim.claim_details ?? [];
  const timelineEntries = timeline ?? [];

  const handleAction = async () => {
    const statusMap: Record<string, ClaimStatus> = {
      approve: "aprobado",
      reject: "rechazado",
      request: "solicitando_antecedentes",
    };
    const newStatus = statusMap[actionDialog!];

    try {
      await updateMutation.mutateAsync({
        id: claimId,
        input: { status: newStatus },
      });
      await timelineMutation.mutateAsync({
        claim_id: claimId,
        action_type: actionDialog === "approve" ? "aprobado" : actionDialog === "reject" ? "rechazado" : "antecedentes_solicitados",
        description: actionReason || undefined,
      });
      toast.success(`Siniestro ${STATUS_LABELS[newStatus].toLowerCase()}`);
      setActionDialog(null);
      setActionReason("");
    } catch (err) {
      toast.error("Error", { description: err instanceof Error ? err.message : undefined });
    }
  };

  const isPending = updateMutation.isPending || timelineMutation.isPending;
  const canAct = claim.status === "asignado" || claim.status === "en_revision" || claim.status === "solicitando_antecedentes";

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/liquidacion">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="app-page-title">
              {claim.claim_number}
            </h1>
            <Badge variant={STATUS_VARIANT[claim.status]}>
              {STATUS_LABELS[claim.status] ?? claim.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {insured ? `${insured.first_name} ${insured.last_name}` : "-"}
            {policy ? ` - Poliza ${policy.policy_number}` : ""}
          </p>
        </div>
        {canAct && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActionDialog("request")}
              disabled={isPending}
            >
              <FileQuestion className="mr-2 size-4" />
              Solicitar antecedentes
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setActionDialog("reject")}
              disabled={isPending}
            >
              <X className="mr-2 size-4" />
              Rechazar
            </Button>
            <Button
              size="sm"
              onClick={() => setActionDialog("approve")}
              disabled={isPending}
            >
              <Check className="mr-2 size-4" />
              Aprobar
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="financiero">
            Financiero ({details.length})
          </TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">
            Timeline ({timelineEntries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard label="Numero" value={claim.claim_number} />
            <InfoCard label="Fecha incidente" value={formatDate(claim.incident_date)} />
            <InfoCard label="Fecha reporte" value={formatDate(claim.report_date)} />
            <InfoCard label="Poliza" value={policy?.policy_number ?? "-"} />
            <InfoCard label="Titular poliza" value={policy?.holder_name ?? "-"} />
            <InfoCard label="Asegurado" value={insured ? `${insured.first_name} ${insured.last_name}` : "-"} />
            <InfoCard label="RUT asegurado" value={insured?.rut ?? "-"} />
            <InfoCard label="Monto solicitado" value={formatCurrency(claim.amount_requested)} />
            <InfoCard
              label="Reembolso final"
              value={claim.final_reimbursement != null ? formatCurrency(claim.final_reimbursement) : "Pendiente"}
            />
            <InfoCard label="Descripcion" value={claim.description ?? "-"} />
          </div>
        </TabsContent>

        <TabsContent value="financiero" className="mt-4">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Diagnostico</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Deducible</TableHead>
                  <TableHead className="text-right">Copago</TableHead>
                  <TableHead className="text-right">Reembolso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground text-center">
                      <div className="flex flex-col items-center gap-2 py-8">
                        <Calculator className="size-8 opacity-40" />
                        <p>Sin detalles financieros</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {details.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(d.service_date)}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-muted-foreground">-</TableCell>
                    <TableCell className="text-right">{formatCurrency(d.amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(d.deductible_applied)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(d.copayment_applied)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(d.final_reimbursement)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="documentos" className="mt-4">
          <div className="flex flex-col items-center gap-4 py-12">
            <FileText className="text-muted-foreground size-12 opacity-40" />
            <p className="text-muted-foreground text-sm">
              Los documentos se gestionan desde Supabase Storage (bucket claims_documents)
            </p>
            <p className="text-muted-foreground text-xs">
              Funcionalidad de upload disponible en una proxima iteracion
            </p>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <div className="rounded-lg border">
            <div className="space-y-0">
              {timelineEntries.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-8">
                  <Clock className="text-muted-foreground size-8 opacity-40" />
                  <p className="text-muted-foreground text-sm">Sin eventos registrados</p>
                </div>
              )}
              {timelineEntries.map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 border-b p-4 last:border-0"
                >
                  <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {entry.action_type.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                    {entry.description && (
                      <p className="mt-1 text-sm">{entry.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action dialog */}
      <Dialog open={actionDialog !== null} onOpenChange={(v) => !v && setActionDialog(null)}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>
              {actionDialog === "approve" && "Aprobar siniestro"}
              {actionDialog === "reject" && "Rechazar siniestro"}
              {actionDialog === "request" && "Solicitar antecedentes"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog === "approve" && "Confirma la aprobacion del siniestro."}
              {actionDialog === "reject" && "Indica el motivo del rechazo."}
              {actionDialog === "request" && "Describe los antecedentes solicitados."}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Motivo / descripcion</Label>
            <Input
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder={
                actionDialog === "approve"
                  ? "Observaciones de aprobacion..."
                  : actionDialog === "reject"
                    ? "Motivo del rechazo..."
                    : "Antecedentes solicitados..."
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancelar
            </Button>
            <Button
              variant={actionDialog === "reject" ? "destructive" : "default"}
              onClick={handleAction}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  );
}
