"use client";

import { Users } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useLiquidatorWorkload } from "@/hooks/use-operaciones";
import { formatCurrency } from "@/utils/format";

export function LiquidadoresDashboardPage() {
  const { data: workload, isLoading } = useLiquidatorWorkload();

  const totalActive =
    workload?.reduce((sum, w) => sum + (w.active_claims ?? 0), 0) ?? 0;
  const totalApproved =
    workload?.reduce((sum, w) => sum + (w.approved ?? 0), 0) ?? 0;
  const totalAmount =
    workload?.reduce((sum, w) => sum + (w.active_amount ?? 0), 0) ?? 0;

  return (
    <div className="app-page">
      <PageHeader
        title="Dashboard de Liquidadores"
        lead="Carga de trabajo actual por liquidador"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Liquidadores activos"
          value={String(workload?.length ?? 0)}
        />
        <KpiCard label="Siniestros activos" value={String(totalActive)} />
        <KpiCard label="Monto activo total" value={formatCurrency(totalAmount)} />
        <KpiCard label="Aprobados (historico)" value={String(totalApproved)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carga de trabajo</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && <LoadingState context="table" />}
          {!isLoading && (workload ?? []).length === 0 && (
            <EmptyState
              icon={<Users className="size-6" />}
              title="No hay liquidadores activos"
              description="No se encontraron datos de carga de liquidadores."
            />
          )}
          {!isLoading && (workload ?? []).length > 0 && (
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
                {(workload ?? []).map((w) => (
                  <TableRow key={w.user_id}>
                    <TableCell className="font-medium">
                      {w.full_name || "Sin nombre"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          (w.active_claims ?? 0) > 5
                            ? "destructive"
                            : "default"
                        }
                      >
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
