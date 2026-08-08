"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useInsuredsByPolicy,
  useSearchInsuredsByRut,
  useSearchInsuredsByName,
} from "@/hooks/use-insureds";
import { formatRut, formatDate } from "@/utils/format";
import { InsuredFormDialog } from "./insured-form";
import type { Insured } from "@/types";

const RELATIONSHIP_LABELS: Record<string, string> = {
  titular: "Titular",
  conyuge: "Conyuge",
  hijo: "Hijo",
  otro: "Otro",
};

type SearchMode = "rut" | "name";

export function InsuredsPanel({ policyId }: { policyId: string }) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<SearchMode>("rut");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: allInsureds, isLoading, isError, error, refetch } = useInsuredsByPolicy(policyId);
  const rutQuery = useSearchInsuredsByRut(mode === "rut" ? search : "");
  const nameQuery = useSearchInsuredsByName(mode === "name" ? search : "");

  const insureds = useMemo(() => {
    if (search.length === 0) return allInsureds ?? [];
    if (mode === "rut") return rutQuery.data ?? [];
    return nameQuery.data ?? [];
  }, [search, mode, allInsureds, rutQuery.data, nameQuery.data]);

  const showLoading =
    search.length > 0
      ? mode === "rut"
        ? rutQuery.isLoading
        : nameQuery.isLoading
      : isLoading;

  if (isError) {
    return (
      <ErrorState
        title="Error al cargar asegurados"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="app-page-lead">Titulares y cargas de la poliza</p>
        <Button onClick={() => setDialogOpen(true)} className="btn-primary">
          <Plus className="mr-2 size-4" />
          Nuevo asegurado
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={mode === "rut" ? "Buscar por RUT..." : "Buscar por nombre..."}
            aria-label={mode === "rut" ? "Buscar por RUT" : "Buscar por nombre"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="app-input h-7 ps-input-with-icon"
          />
        </div>
        <div className="flex rounded-lg border">
          <button
            type="button"
            onClick={() => setMode("rut")}
            className={
              mode === "rut"
                ? "bg-primary text-primary-foreground rounded-l-lg px-3 py-1.5 text-sm"
                : "text-muted-foreground px-3 py-1.5 text-sm"
            }
          >
            RUT
          </button>
          <button
            type="button"
            onClick={() => setMode("name")}
            className={
              mode === "name"
                ? "bg-primary text-primary-foreground rounded-r-lg px-3 py-1.5 text-sm"
                : "text-muted-foreground px-3 py-1.5 text-sm"
            }
          >
            Nombre
          </button>
        </div>
      </div>

      {showLoading && <LoadingState context="table" className="app-card" />}

      {!showLoading && (
        <div className="app-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RUT</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Relacion</TableHead>
                <TableHead>Nacimiento</TableHead>
                <TableHead className="w-24">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insureds.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2 py-8">
                      <Users className="size-8 opacity-40" />
                      <p>No hay asegurados registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {insureds.map((insured: Insured) => (
                <TableRow key={insured.id}>
                  <TableCell className="font-mono">
                    {formatRut(insured.rut)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {insured.first_name} {insured.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={insured.is_titular ? "default" : "secondary"}>
                      {RELATIONSHIP_LABELS[insured.relationship] ?? insured.relationship}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(insured.birth_date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={insured.is_active ? "default" : "secondary"}>
                      {insured.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/polizas/${policyId}/asegurados/${insured.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <InsuredFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        policyId={policyId}
      />
    </div>
  );
}
