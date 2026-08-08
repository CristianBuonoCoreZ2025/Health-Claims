import Link from "next/link";
import { Plus, FileText, FileSpreadsheet, TrendingUp, TrendingDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/utils/format";
import type { ClaimStatus } from "@/types";

const KPI_DATA = [
  {
    label: "Siniestros pendientes",
    value: "24",
    variation: "+5%",
    trend: "positive" as const,
    accent: "var(--primary)",
    icon: FileText,
  },
  {
    label: "Siniestros aprobados",
    value: "128",
    variation: "+12%",
    trend: "positive" as const,
    accent: "#10b981",
    icon: TrendingUp,
  },
  {
    label: "Monto liquidado",
    value: formatCurrency(3240000),
    variation: "+8%",
    trend: "positive" as const,
    accent: "#8b5cf6",
    icon: FileSpreadsheet,
  },
  {
    label: "Rechazos",
    value: "9",
    variation: "-2%",
    trend: "negative" as const,
    accent: "#ef4444",
    icon: TrendingDown,
  },
];

const STATUS_LABELS: Record<ClaimStatus, string> = {
  ingresado: "Ingresado",
  asignado: "Asignado",
  en_revision: "En revision",
  solicitando_antecedentes: "Solicitando antecedentes",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  pagado: "Pagado",
};

const STATUS_VARIANTS: Record<
  ClaimStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ingresado: "secondary",
  asignado: "secondary",
  en_revision: "default",
  solicitando_antecedentes: "outline",
  aprobado: "default",
  rechazado: "destructive",
  pagado: "default",
};

const STATUS_COUNTS: { status: ClaimStatus; count: number }[] = [
  { status: "ingresado", count: 4 },
  { status: "asignado", count: 3 },
  { status: "en_revision", count: 7 },
  { status: "solicitando_antecedentes", count: 2 },
  { status: "aprobado", count: 12 },
  { status: "rechazado", count: 9 },
  { status: "pagado", count: 28 },
];

type RecentClaim = {
  number: string;
  date: string;
  insured: string;
  amount: number;
  status: ClaimStatus;
};

const RECENT_CLAIMS: RecentClaim[] = [
  { number: "SIN-2025-001", date: "2025-08-12", insured: "Ana Lopez", amount: 245000, status: "aprobado" },
  { number: "SIN-2025-002", date: "2025-08-11", insured: "Carlos Ruiz", amount: 180000, status: "en_revision" },
  { number: "SIN-2025-003", date: "2025-08-10", insured: "Maria Soto", amount: 95000, status: "ingresado" },
  { number: "SIN-2025-004", date: "2025-08-09", insured: "Pedro Gonzalez", amount: 320000, status: "rechazado" },
  { number: "SIN-2025-005", date: "2025-08-08", insured: "Laura Martinez", amount: 510000, status: "pagado" },
];

export default function DashboardPage() {
  return (
    <div className="app-page">
      <div className="app-page-header">
        <h1 className="app-page-title">Dashboard</h1>
        <p className="app-page-lead">Resumen de operaciones de siniestros</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPI_DATA.map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <Card key={kpi.label} className="relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-1 w-full"
                style={{ background: kpi.accent }}
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>{kpi.label}</CardDescription>
                  <div
                    className="flex size-8 items-center justify-center rounded-lg"
                    style={{
                      background: `color-mix(in srgb, ${kpi.accent} 12%, transparent)`,
                      color: kpi.accent,
                    }}
                  >
                    <KpiIcon className="size-4" />
                  </div>
                </div>
                <CardTitle className="text-2xl! font-mono tabular-nums">
                  {kpi.value}
                </CardTitle>
                <CardAction>
                  <Badge
                    variant={kpi.trend === "positive" ? "default" : "outline"}
                  >
                    {kpi.variation}
                  </Badge>
                </CardAction>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/liquidacion/nuevo">
            <Plus className="mr-2 size-4" />
            Nuevo siniestro
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/polizas">
            <FileText className="mr-2 size-4" />
            Ver polizas
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/operaciones/reportes">
            <FileSpreadsheet className="mr-2 size-4" />
            Ver reportes
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Siniestros recientes</CardTitle>
          <CardDescription>
            Ultimos movimientos del flujo de liquidacion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Asegurado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_CLAIMS.map((claim) => (
                <TableRow key={claim.number}>
                  <TableCell className="font-mono tabular-nums">
                    {claim.number}
                  </TableCell>
                  <TableCell>{formatDate(claim.date)}</TableCell>
                  <TableCell>{claim.insured}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatCurrency(claim.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[claim.status]}>
                      {STATUS_LABELS[claim.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estados de siniestros</CardTitle>
          <CardDescription>
            Distribucion actual por estado del workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {STATUS_COUNTS.map((sc) => (
              <Badge key={sc.status} variant={STATUS_VARIANTS[sc.status]}>
                {STATUS_LABELS[sc.status]} {sc.count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
