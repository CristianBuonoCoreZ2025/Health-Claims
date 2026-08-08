"use client";

import { FileSpreadsheet, Download, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useLiquidatorWorkload } from "@/hooks/use-operaciones";
import { useClaims } from "@/hooks/use-claims";
import { formatCurrency } from "@/utils/format";

export function ReportesPage() {
  const { data: workload, isLoading: workloadLoading } = useLiquidatorWorkload();
  const { data: claims, isLoading: claimsLoading } = useClaims();

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      const workloadData = (workload ?? []).map((w) => ({
        Liquidador: w.full_name || "Sin nombre",
        "Siniestros Activos": w.active_claims ?? 0,
        Asignados: w.assigned ?? 0,
        "En Revision": w.in_review ?? 0,
        "Solicitando Antecedentes": w.requesting_docs ?? 0,
        Aprobados: w.approved ?? 0,
        Rechazados: w.rejected ?? 0,
        Pagados: w.paid ?? 0,
        Total: w.total_claims ?? 0,
        "Monto Activo": w.active_amount ?? 0,
      }));
      const ws1 = XLSX.utils.json_to_sheet(workloadData);
      XLSX.utils.book_append_sheet(wb, ws1, "Carga Liquidadores");

      const claimsData = (claims ?? []).map((c) => ({
        Numero: c.claim_number,
        "Fecha Incidente": c.incident_date,
        "Fecha Reporte": c.report_date,
        "Monto Solicitado": c.amount_requested,
        "Reembolso Final": c.final_reimbursement ?? 0,
        Estado: c.status,
        Activo: c.is_active ? "Si" : "No",
      }));
      const ws2 = XLSX.utils.json_to_sheet(claimsData);
      XLSX.utils.book_append_sheet(wb, ws2, "Siniestros Recientes");

      const totalActive =
        workload?.reduce((s, w) => s + (w.active_claims ?? 0), 0) ?? 0;
      const totalApproved =
        workload?.reduce((s, w) => s + (w.approved ?? 0), 0) ?? 0;
      const totalRejected =
        workload?.reduce((s, w) => s + (w.rejected ?? 0), 0) ?? 0;
      const totalPaid =
        workload?.reduce((s, w) => s + (w.paid ?? 0), 0) ?? 0;
      const totalAmount =
        workload?.reduce((s, w) => s + (w.active_amount ?? 0), 0) ?? 0;
      const summaryData = [
        { Indicador: "Liquidadores activos", Valor: workload?.length ?? 0 },
        { Indicador: "Siniestros activos", Valor: totalActive },
        { Indicador: "Siniestros aprobados (historico)", Valor: totalApproved },
        { Indicador: "Siniestros rechazados (historico)", Valor: totalRejected },
        { Indicador: "Siniestros pagados (historico)", Valor: totalPaid },
        { Indicador: "Monto activo total", Valor: totalAmount },
        {
          Indicador: "Tasa de aprobacion",
          Valor:
            totalApproved + totalRejected > 0
              ? `${((totalApproved / (totalApproved + totalRejected)) * 100).toFixed(1)}%`
              : "N/A",
        },
      ];
      const ws3 = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws3, "Resumen");

      XLSX.writeFile(
        wb,
        `reporte_productividad_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    });
  };

  const isLoading = workloadLoading || claimsLoading;

  const totalActive =
    workload?.reduce((s, w) => s + (w.active_claims ?? 0), 0) ?? 0;
  const totalApproved =
    workload?.reduce((s, w) => s + (w.approved ?? 0), 0) ?? 0;
  const totalRejected =
    workload?.reduce((s, w) => s + (w.rejected ?? 0), 0) ?? 0;
  const totalAmount =
    workload?.reduce((s, w) => s + (w.active_amount ?? 0), 0) ?? 0;
  const approvalRate =
    totalApproved + totalRejected > 0
      ? ((totalApproved / (totalApproved + totalRejected)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="app-page">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Reporte de Productividad"
          lead="Indicadores clave y exportacion a Excel"
        />
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={isLoading}
        >
          <Download className="mr-2 size-4" />
          Exportar Excel
        </Button>
      </div>

      {isLoading ? (
        <LoadingState context="table" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={<TrendingUp className="size-5" />}
              label="Tasa de aprobacion"
              value={`${approvalRate}%`}
            />
            <KpiCard label="Siniestros activos" value={String(totalActive)} />
            <KpiCard label="Monto activo total" value={formatCurrency(totalAmount)} />
            <KpiCard
              label="Liquidadores activos"
              value={String(workload?.length ?? 0)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="size-4" />
                Productividad por liquidador
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(workload ?? []).length === 0 ? (
                <EmptyState
                  icon={<FileSpreadsheet className="size-6" />}
                  title="No hay datos de productividad"
                  description="No se encontraron liquidadores con carga registrada."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Liquidador</TableHead>
                      <TableHead className="text-right">Activos</TableHead>
                      <TableHead className="text-right">Aprobados</TableHead>
                      <TableHead className="text-right">Rechazados</TableHead>
                      <TableHead className="text-right">Tasa</TableHead>
                      <TableHead className="text-right">Monto activo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(workload ?? []).map((w) => {
                      const total = w.total_claims ?? 0;
                      const approved = w.approved ?? 0;
                      const rate =
                        total > 0 ? ((approved / total) * 100).toFixed(1) : "0.0";
                      return (
                        <TableRow key={w.user_id}>
                          <TableCell className="font-medium">
                            {w.full_name || "Sin nombre"}
                          </TableCell>
                          <TableCell className="text-right">
                            {w.active_claims ?? 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {approved}
                          </TableCell>
                          <TableCell className="text-right">
                            {w.rejected ?? 0}
                          </TableCell>
                          <TableCell className="text-right">{rate}%</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(w.active_amount ?? 0)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon && <span className="text-primary">{icon}</span>}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
