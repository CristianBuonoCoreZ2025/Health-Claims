"use client";

import { useState, useMemo } from "react";
import { Search, Loader2, FileCode } from "lucide-react";

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
import { useDiagnostics } from "@/hooks/use-diagnostics";
import { useSearchDiagnosticsByCode } from "@/hooks/use-diagnostics";
import { useSearchDiagnosticsByName } from "@/hooks/use-diagnostics";

type SearchMode = "code" | "name";

export function DiagnosticsPage() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<SearchMode>("code");

  const { data: allDiagnostics, isLoading } = useDiagnostics();
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

  return (
    <div className="app-page">
      <div className="app-page-header">
        <h1 className="app-page-title">Diagnosticos</h1>
        <p className="app-page-lead">
          Catalogo CIE-10 con busqueda por codigo y palabra clave
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={mode === "code" ? "Buscar por codigo CIE-10..." : "Buscar por nombre..."}
            aria-label={mode === "code" ? "Buscar por codigo CIE-10" : "Buscar por nombre"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="app-input h-7 ps-input-with-icon"
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

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Codigo CIE-10</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="w-24">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!showLoading && diagnostics.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <FileCode className="size-8 opacity-40" />
                    <p>No se encontraron diagnosticos</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!showLoading &&
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
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
