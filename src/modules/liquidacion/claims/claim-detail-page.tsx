"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Clock, FileQuestion, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/ui/loading-state";
import { useClaimTimeline, useCreateTimelineEntry } from "@/hooks/use-claim-timeline";
import { useClaimWithRelations, useUpdateClaim } from "@/hooks/use-claims";
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
  const router = useRouter();
  const { data: claim, isLoading, isError, error, refetch } = useClaimWithRelations(claimId);
  const { data: timeline, isLoading: isLoadingTimeline } = useClaimTimeline(claimId);
  const updateMutation = useUpdateClaim();
  const timelineMutation = useCreateTimelineEntry();

  const [actionDialog, setActionDialog] = useState<null | "approve" | "reject" | "request">(null);
  const [actionReason, setActionReason] = useState("");

  if (isLoading) {
    return (
      <div className="app-page">
        <LoadingState />
      </div>
    );
  }

  if (isError || !claim) {
    return (
      <div className="app-page">
        <ErrorState
          title="Siniestro no encontrado"
          description={error?.message}
          onRetry={refetch}
        />
      </div>
    );
  }

  const policy = claim.policies;
  const insured = claim.insureds;
  const timelineEntries = timeline ?? [];
  const canAct =
    claim.status === "asignado" ||
    claim.status === "en_revision" ||
    claim.status === "solicitando_antecedentes";

  const handleAction = async () => {
    const statusMap: Record<string, ClaimStatus> = {
      approve: "aprobado",
      reject: "rechazado",
      request: "solicitando_antecedentes",
    };
    const newStatus = statusMap[actionDialog!];

    try {
      await updateMutation.mutateAsync({ id: claimId, input: { status: newStatus } });
      await timelineMutation.mutateAsync({
        claim_id: claimId,
        action_type:
          actionDialog === "approve"
            ? "aprobado"
            : actionDialog === "reject"
              ? "rechazado"
              : "antecedentes_solicitados",
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
  const actionTitle =
    actionDialog === "approve" ? "Aprobar siniestro" :
    actionDialog === "reject" ? "Rechazar siniestro" : "Solicitar antecedentes";
  const actionDescription =
    actionDialog === "approve" ? "Confirma la aprobacion del siniestro." :
    actionDialog === "reject" ? "Indica el motivo del rechazo." : "Describe los antecedentes solicitados.";

  return (
    <div className="app-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/liquidacion")}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="app-page-title">{claim.claim_number}</h1>
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
            <Button variant="outline" size="sm" onClick={() => setActionDialog("request")} disabled={isPending}>
              <FileQuestion className="mr-2 size-4" />
              Solicitar antecedentes
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setActionDialog("reject")} disabled={isPending}>
              <X className="mr-2 size-4" />
              Rechazar
            </Button>
            <Button size="sm" onClick={() => setActionDialog("approve")} disabled={isPending}>
              <Check className="mr-2 size-4" />
              Aprobar
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informacion del siniestro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Numero" value={claim.claim_number} />
            <InfoRow label="Fecha incidente" value={formatDate(claim.incident_date)} />
            <InfoRow label="Fecha reporte" value={formatDate(claim.report_date)} />
            <InfoRow label="Poliza" value={policy?.policy_number ?? "-"} />
            <InfoRow label="Titular poliza" value={policy?.holder_name ?? "-"} />
            <InfoRow label="Asegurado" value={insured ? `${insured.first_name} ${insured.last_name}` : "-"} />
            <InfoRow label="RUT asegurado" value={insured?.rut ?? "-"} />
            <InfoRow label="Monto solicitado" value={formatCurrency(claim.amount_requested)} />
            <InfoRow label="Reembolso final" value={claim.final_reimbursement != null ? formatCurrency(claim.final_reimbursement) : "Pendiente"} />
            <InfoRow label="Descripcion" value={claim.description ?? "-"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTimeline ? (
              <LoadingState />
            ) : timelineEntries.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <Clock className="text-muted-foreground size-8 opacity-40" />
                <p className="text-muted-foreground text-sm">Sin eventos registrados</p>
              </div>
            ) : (
              <div className="space-y-0">
                {timelineEntries.map((entry, i) => (
                  <div key={entry.id} className="flex items-start gap-3 border-b py-3 last:border-0">
                    <div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.action_type.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{formatDate(entry.created_at)}</span>
                      </div>
                      {entry.description && <p className="mt-1 text-sm">{entry.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={actionDialog !== null} onOpenChange={(v) => !v && setActionDialog(null)}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>{actionTitle}</DialogTitle>
            <DialogDescription>{actionDescription}</DialogDescription>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b py-2 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-right text-sm font-medium">{value || "-"}</span>
    </div>
  );
}
