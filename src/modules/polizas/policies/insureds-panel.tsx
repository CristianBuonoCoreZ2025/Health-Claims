"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Loader2, Users } from "lucide-react";

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

  const { data: allInsureds, isLoading } = useInsuredsByPolicy(policyId);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Titulares y cargas de la poliza
        </p>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Nuevo asegurado
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={mode === "rut" ? "Buscar por RUT..." : "Buscar por nombre..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
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

      <div className="rounded-lg border">
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
            {showLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <Loader2 className="text-muted-foreground mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!showLoading && insureds.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Users className="size-8 opacity-40" />
                    <p>No hay asegurados registrados</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!showLoading &&
              insureds.map((insured: Insured) => (
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

      <InsuredFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        policyId={policyId}
      />
    </div>
  );
}
