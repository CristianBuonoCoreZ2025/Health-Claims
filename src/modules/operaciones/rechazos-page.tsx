"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw, Ban, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useClaimRejections,
  useReingresarSiniestro,
  useAnularSiniestro,
} from "@/hooks/use-operaciones";
import { formatDate, formatCurrency } from "@/utils/format";

export function RechazosPage() {
  const { data: rejections, isLoading } = useClaimRejections();
  const reingresarMutation = useReingresarSiniestro();
  const anularMutation = useAnularSiniestro();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<"reingresar" | "anular">("reingresar");
  const [selectedClaim, setSelectedClaim] = useState<string>("");
  const [description, setDescription] = useState("");

  const handleAction = (claimId: string, type: "reingresar" | "anular") => {
    setSelectedClaim(claimId);
    setAction(type);
    setDescription("");
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      if (action === "reingresar") {
        await reingresarMutation.mutateAsync({
          claimId: selectedClaim,
          description: description || undefined,
        });
      } else {
        await anularMutation.mutateAsync({
          claimId: selectedClaim,
          description: description || undefined,
        });
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error("Error", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const isPending = reingresarMutation.isPending || anularMutation.isPending;

  return (
    <div className="app-page">
      <PageHeader
        title="Rechazos"
        lead="Siniestros rechazados con acciones de reingreso y anulacion"
      />

      <Card>
        <CardHeader>
          <CardTitle>Siniestros rechazados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && <LoadingState context="table" />}
          {!isLoading && (rejections ?? []).length === 0 && (
            <EmptyState
              icon={<Ban className="size-6" />}
              title="No hay siniestros rechazados"
              description="No se encontraron siniestros en estado rechazado."
            />
          )}
          {!isLoading && (rejections ?? []).length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numero</TableHead>
                  <TableHead>Asegurado</TableHead>
                  <TableHead>Titular poliza</TableHead>
                  <TableHead>Fecha rechazo</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rejections ?? []).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono font-medium">
                      {r.claim_number}
                    </TableCell>
                    <TableCell>
                      {r.insured_first_name} {r.insured_last_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.holder_name ?? "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(r.rejected_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {r.rejection_reason ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(r.amount_requested)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.is_active ? "destructive" : "outline"}>
                        {r.is_active ? "Rechazado" : "Anulado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/liquidacion/${r.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        {r.is_active && r.id && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction(r.id!, "reingresar")}
                              title="Reingresar"
                            >
                              <RotateCcw className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction(r.id!, "anular")}
                              title="Anular"
                            >
                              <Ban className="size-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>
              {action === "reingresar"
                ? "Reingresar siniestro"
                : "Anular siniestro"}
            </DialogTitle>
            <DialogDescription>
              {action === "reingresar"
                ? "El siniestro sera reasignado automaticamente al liquidador con menos carga."
                : "El siniestro sera marcado como anulado e inactivo."}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Motivo / descripcion</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                action === "reingresar"
                  ? "Razon del reingreso..."
                  : "Motivo de anulacion..."
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={action === "anular" ? "destructive" : "default"}
              onClick={handleConfirm}
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
