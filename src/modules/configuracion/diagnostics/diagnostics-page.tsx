"use client";

import { useState, useMemo } from "react";
import { Search, FileCode } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDiagnostics } from "@/hooks/use-diagnostics";
import { useSearchDiagnosticsByCode } from "@/hooks/use-diagnostics";
import { useSearchDiagnosticsByName } from "@/hooks/use-diagnostics";

type SearchMode = "code" | "name";

export function DiagnosticsPage() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<SearchMode>("code");

  const { data: allDiagnostics, isLoading, isError, error, refetch } = useDiagnostics();
  const codeQuery = useSearchDiagnosticsByCode(mode === "code" ? search : "");
  const nameQuery = useSearchDiagnosticsByName(mode === "name" ? search : "");

  const diagnostics = useMemo(() => {
    if (search.length === 0) return allDiagnostics ?? [];
    if (mode === "code") return codeQuery.data ?? [];
    return nameQuery.data ?? [];
  }, [search, mode, allDiagnostics, codeQuery.data, nameQuery.data]);

  const showLoading =
    search.length > 0
      ? mode === "code"
        ? codeQuery.isLoading
        : nameQuery.isLoading
      : isLoading;

  if (isError) {
    return (
      <div className="app-page">
        <PageHeader title="Diagnosticos" lead="Catalogo CIE-10 con busqueda por codigo y palabra clave" />
        <ErrorState
          title="Error al cargar diagnosticos"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="app-page">
      <PageHeader title="Diagnosticos" lead="Catalogo CIE-10 con busqueda por codigo y palabra clave" />

      <div className="flex items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={mode === "code" ? "Buscar por codigo CIE-10..." : "Buscar por nombre..."}
            aria-label={mode === "code" ? "Buscar por codigo CIE-10" : "Buscar por nombre"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="app-input h-8 ps-input-with-icon"
          />
        </div>
        <div className="flex rounded-lg border">
          <button
            type="button"
            onClick={() => setMode("code")}
            className={
              mode === "code"
                ? "bg-primary text-primary-foreground rounded-l-lg px-3 py-1.5 text-sm"
                : "text-muted-foreground px-3 py-1.5 text-sm"
            }
          >
            Codigo
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
                <TableHead className="w-32">Codigo CIE-10</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="w-24">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagnostics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <EmptyState
                      icon={<FileCode className="size-8 opacity-40" />}
                      title="No se encontraron diagnosticos"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                diagnostics.map((diag) => (
                  <TableRow key={diag.id}>
                    <TableCell className="font-mono font-medium">
                      {diag.code_cie10}
                    </TableCell>
                    <TableCell>{diag.name}</TableCell>
                    <TableCell>
                      <Badge variant={diag.is_active ? "default" : "secondary"}>
                        {diag.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
