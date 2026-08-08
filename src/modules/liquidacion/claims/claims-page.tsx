"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, FileText, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClaims, useClaimsByStatus, useSearchClaimsByNumber } from "@/hooks/use-claims";
import { formatCurrency } from "@/utils/format";
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

  const allQuery = useClaims();
  const searchQuery = useSearchClaimsByNumber(search);
  const statusQuery = useClaimsByStatus(
    statusFilter !== "all" ? (statusFilter as ClaimStatus) : "ingresado"
  );

  const mode: FilterMode = search.length > 0 ? "search" : statusFilter !== "all" ? "status" : "all";

  const claims = useMemo(() => {
    if (mode === "search") return searchQuery.data ?? [];
    if (mode === "status") return statusQuery.data ?? [];
    return allQuery.data ?? [];
  }, [mode, searchQuery.data, statusQuery.data, allQuery.data]);

  const { isLoading, isError, error, refetch } = useMemo(() => {
    if (mode === "search") {
      return {
        isLoading: searchQuery.isLoading,
        isError: searchQuery.isError,
        error: searchQuery.error,
        refetch: searchQuery.refetch,
      };
    }
    if (mode === "status") {
      return {
        isLoading: statusQuery.isLoading,
        isError: statusQuery.isError,
        error: statusQuery.error,
        refetch: statusQuery.refetch,
      };
    }
    return {
      isLoading: allQuery.isLoading,
      isError: allQuery.isError,
      error: allQuery.error,
      refetch: allQuery.refetch,
    };
  }, [mode, allQuery, searchQuery, statusQuery]);

  if (isError) {
    return (
      <div className="app-page">
        <PageHeader title="Liquidacion" lead="Gestion de siniestros" />
        <ErrorState
          title="Error al cargar siniestros"
          description={error?.message}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="app-page">
      <PageHeader title="Liquidacion" lead="Gestion de siniestros" />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            aria-label="Buscar por numero de siniestro"
            className="app-input h-7 ps-input-with-icon"
            placeholder="Buscar por numero de siniestro..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value) setStatusFilter("all");
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            if (v !== "all") setSearch("");
          }}
        >
          <SelectTrigger aria-label="Filtrar por estado" className="app-input h-7 w-full sm:w-48">
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
        <Button asChild className="ml-auto">
          <Link href="/liquidacion/nuevo">
            <Plus className="mr-2 size-4" />
            Nuevo siniestro
          </Link>
        </Button>
      </div>

      <div className="app-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">N</TableHead>
              <TableHead>Liquidacion</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Compania</TableHead>
              <TableHead>Asegurado</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <LoadingState context="table" />
                </TableCell>
              </TableRow>
            ) : claims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState
                    icon={<FileText className="size-8 opacity-40" />}
                    title="No se encontraron siniestros"
                  />
                </TableCell>
              </TableRow>
            ) : (
              claims.map((claim: Claim, index: number) => (
                <TableRow key={claim.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-mono font-medium">{claim.claim_number}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[claim.status]}>
                      {STATUS_LABELS[claim.status] ?? claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono">
                    {claim.company_settlement_code ?? claim.policy_id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono">
                    {claim.insured_settlement_code ?? claim.insured_id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(claim.amount_requested)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild aria-label="Ver siniestro" variant="ghost" size="icon">
                      <Link href={`/liquidacion/${claim.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
