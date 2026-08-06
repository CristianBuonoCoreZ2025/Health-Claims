"use client";

import { Loader2, FileSpreadsheet, Download, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLiquidatorWorkload } from "@/hooks/use-operaciones";
import { useClaims } from "@/hooks/use-claims";
import { formatCurrency } from "@/utils/format";

export function ReportesPage() {
  const { data: workload, isLoading: workloadLoading } = useLiquidatorWorkload();
  const { data: claims, isLoading: claimsLoading } = useClaims();

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // Hoja 1: Carga de trabajo por liquidador.
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

      // Hoja 2: Siniestros recientes.
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

      // Hoja 3: Resumen de productividad.
      const totalActive = workload?.reduce((s, w) => s + (w.active_claims ?? 0), 0) ?? 0;
      const totalApproved = workload?.reduce((s, w) => s + (w.approved ?? 0), 0) ?? 0;
      const totalRejected = workload?.reduce((s, w) => s + (w.rejected ?? 0), 0) ?? 0;
      const totalPaid = workload?.reduce((s, w) => s + (w.paid ?? 0), 0) ?? 0;
      const totalAmount = workload?.reduce((s, w) => s + (w.active_amount ?? 0), 0) ?? 0;
      const summaryData = [
        { Indicador: "Liquidadores activos", Valor: workload?.length ?? 0 },
        { Indicador: "Siniestros activos", Valor: totalActive },
        { Indicador: "Siniestros aprobados (historico)", Valor: totalApproved },
        { Indicador: "Siniestros rechazados (historico)", Valor: totalRejected },
        { Indicador: "Siniestros pagados (historico)", Valor: totalPaid },
        { Indicador: "Monto activo total", Valor: totalAmount },
        {
          Indicador: "Tasa de aprobacion",
          Valor: totalApproved + totalRejected > 0
            ? `${((totalApproved / (totalApproved + totalRejected)) * 100).toFixed(1)}%`
            : "N/A",
        },
      ];
      const ws3 = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws3, "Resumen");

      XLSX.writeFile(wb, `reporte_productividad_${new Date().toISOString().split("T")[0]}.xlsx`);
    });
  };

  const isLoading = workloadLoading || claimsLoading;

  const totalActive = workload?.reduce((s, w) => s + (w.active_claims ?? 0), 0) ?? 0;
  const totalApproved = workload?.reduce((s, w) => s + (w.approved ?? 0), 0) ?? 0;
  const totalRejected = workload?.reduce((s, w) => s + (w.rejected ?? 0), 0) ?? 0;
  const totalAmount = workload?.reduce((s, w) => s + (w.active_amount ?? 0), 0) ?? 0;
  const approvalRate =
    totalApproved + totalRejected > 0
      ? ((totalApproved / (totalApproved + totalRejected)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reporte de Productividad</h1>
          <p className="text-muted-foreground text-sm">
            Indicadores clave y exportacion a Excel
          </p>
        </div>
        <Button onClick={handleExport} disabled={isLoading}>
          <Download className="mr-2 size-4" />
          Exportar Excel
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* KPIs principales */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={<TrendingUp className="size-5" />}
              label="Tasa de aprobacion"
              value={`${approvalRate}%`}
            />
            <KpiCard
              label="Siniestros activos"
              value={String(totalActive)}
            />
            <KpiCard
              label="Monto activo total"
              value={formatCurrency(totalAmount)}
            />
            <KpiCard
              label="Liquidadores activos"
              value={String(workload?.length ?? 0)}
            />
          </div>

          {/* Tabla de productividad */}
          <div className="rounded-lg border">
            <div className="bg-muted/50 border-b px-4 py-3">
              <h3 className="flex items-center gap-2 font-medium">
                <FileSpreadsheet className="size-4" />
                Productividad por liquidador
              </h3>
            </div>
            <div className="divide-y">
              {(workload ?? []).map((w) => {
                const total = w.total_claims ?? 0;
                const approved = w.approved ?? 0;
                const rate = total > 0 ? ((approved / total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={w.user_id} className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <p className="font-medium">{w.full_name || "Sin nombre"}</p>
                      <p className="text-muted-foreground text-sm">
                        {w.active_claims ?? 0} activos - {approved} aprobados - {w.rejected ?? 0} rechazados
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{rate}%</p>
                      <p className="text-muted-foreground text-xs">tasa aprobacion</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(w.active_amount ?? 0)}</p>
                      <p className="text-muted-foreground text-xs">monto activo</p>
                    </div>
                  </div>
                );
              })}
              {(workload ?? []).length === 0 && (
                <div className="text-muted-foreground p-8 text-center">
                  No hay datos de productividad disponibles
                </div>
              )}
            </div>
          </div>
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
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2">
        {icon && <div className="text-primary">{icon}</div>}
        <p className="text-muted-foreground text-xs">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
