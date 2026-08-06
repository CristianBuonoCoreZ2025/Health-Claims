"use client";

import { Loader2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLiquidatorWorkload } from "@/hooks/use-operaciones";
import { formatCurrency } from "@/utils/format";

export function LiquidadoresDashboardPage() {
  const { data: workload, isLoading } = useLiquidatorWorkload();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard de Liquidadores</h1>
        <p className="text-muted-foreground text-sm">
          Carga de trabajo actual por liquidador
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Liquidadores activos"
          value={String(workload?.length ?? 0)}
        />
        <KpiCard
          label="Siniestros activos"
          value={String(
            workload?.reduce((sum, w) => sum + (w.active_claims ?? 0), 0) ?? 0
          )}
        />
        <KpiCard
          label="Monto activo total"
          value={formatCurrency(
            workload?.reduce((sum, w) => sum + (w.active_amount ?? 0), 0) ?? 0
          )}
        />
        <KpiCard
          label="Aprobados (historico)"
          value={String(
            workload?.reduce((sum, w) => sum + (w.approved ?? 0), 0) ?? 0
          )}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Liquidador</TableHead>
              <TableHead className="text-right">Activos</TableHead>
              <TableHead className="text-right">Asignados</TableHead>
              <TableHead className="text-right">En revision</TableHead>
              <TableHead className="text-right">Solic. anteced.</TableHead>
              <TableHead className="text-right">Aprobados</TableHead>
              <TableHead className="text-right">Rechazados</TableHead>
              <TableHead className="text-right">Pagados</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Monto activo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={10} className="text-muted-foreground text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (workload ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Users className="size-8 opacity-40" />
                    <p>No hay liquidadores activos</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              (workload ?? []).map((w) => (
                <TableRow key={w.user_id}>
                  <TableCell className="font-medium">
                    {w.full_name || "Sin nombre"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={(w.active_claims ?? 0) > 5 ? "destructive" : "default"}>
                      {w.active_claims ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {w.assigned ?? 0}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {w.in_review ?? 0}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {w.requesting_docs ?? 0}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {w.approved ?? 0}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {w.rejected ?? 0}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {w.paid ?? 0}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {w.total_claims ?? 0}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(w.active_amount ?? 0)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
