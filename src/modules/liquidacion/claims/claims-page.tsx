"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, Eye, Loader2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useClaims,
  useSearchClaimsByNumber,
  useClaimsByStatus,
} from "@/hooks/use-claims";
import { formatDate, formatCurrency } from "@/utils/format";
import type { Claim, ClaimStatus } from "@/types";

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

type FilterMode = "all" | "search" | "status";

export function ClaimsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: allClaims, isLoading } = useClaims();
  const searchQuery = useSearchClaimsByNumber(search);
  const statusQuery = useClaimsByStatus(
    statusFilter !== "all" ? (statusFilter as ClaimStatus) : "ingresado"
  );

  const mode: FilterMode = search.length > 0 ? "search" : statusFilter !== "all" ? "status" : "all";

  const claims = useMemo(() => {
    if (mode === "search") return searchQuery.data ?? [];
    if (mode === "status") return statusQuery.data ?? [];
    return allClaims ?? [];
  }, [mode, searchQuery.data, statusQuery.data, allClaims]);

  const showLoading =
    mode === "search" ? searchQuery.isLoading : mode === "status" ? statusQuery.isLoading : isLoading;

  return (
    <div className="app-page">
      <div className="flex items-center justify-between">
        <div className="app-page-header">
          <h1 className="app-page-title">Siniestros</h1>
          <p className="app-page-lead">
            Liquidacion de siniestros y reembolsos
          </p>
        </div>
        <Button asChild>
          <Link href="/liquidacion/nuevo">
            <Plus className="mr-2 size-4" />
            Nuevo siniestro
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por numero de siniestro..."
            aria-label="Buscar por numero de siniestro"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value) setStatusFilter("all");
            }}
            className="app-input h-7 ps-input-with-icon"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            if (v !== "all") setSearch("");
          }}
        >
          <SelectTrigger className="app-input h-7 w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numero</TableHead>
              <TableHead>Incidente</TableHead>
              <TableHead>Reporte</TableHead>
              <TableHead className="text-right">Monto solicitado</TableHead>
              <TableHead className="text-right">Reembolso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!showLoading && claims.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <FileText className="size-8 opacity-40" />
                    <p>No se encontraron siniestros</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!showLoading &&
              claims.map((claim: Claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-mono font-medium">
                    {claim.claim_number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(claim.incident_date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(claim.report_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(claim.amount_requested)}
                  </TableCell>
                  <TableCell className="text-right">
                    {claim.final_reimbursement != null
                      ? formatCurrency(claim.final_reimbursement)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[claim.status]}>
                      {STATUS_LABELS[claim.status] ?? claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/liquidacion/${claim.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
