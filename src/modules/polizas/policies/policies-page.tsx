"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, FileText, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

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
  usePolicies,
  useDeletePolicy,
  useSearchPoliciesByNumber,
  usePoliciesByStatus,
} from "@/hooks/use-policies";
import { useContractors } from "@/hooks/use-contractors";
import { PolicyFormDialog } from "./policy-form";
import { formatDate } from "@/utils/format";
import type { Policy, PolicyStatus } from "@/types";

const STATUS_VARIANT: Record<PolicyStatus, "default" | "secondary" | "destructive" | "outline"> = {
  vigente: "default",
  pendiente: "secondary",
  vencida: "outline",
  anulada: "destructive",
};

const STATUS_LABELS: Record<string, string> = {
  vigente: "Vigente",
  vencida: "Vencida",
  anulada: "Anulada",
  pendiente: "Pendiente",
};

type FilterMode = "all" | "search" | "status";

export function PoliciesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Policy | null>(null);

  const { data: allPolicies, isLoading } = usePolicies();
  const searchQuery = useSearchPoliciesByNumber(search);
  const statusQuery = usePoliciesByStatus(statusFilter !== "all" ? (statusFilter as PolicyStatus) : "vigente");
  const { data: contractors } = useContractors();

  const mode: FilterMode = search.length > 0 ? "search" : statusFilter !== "all" ? "status" : "all";

  const policies = useMemo(() => {
    if (mode === "search") return searchQuery.data ?? [];
    if (mode === "status") return statusQuery.data ?? [];
    return allPolicies ?? [];
  }, [mode, searchQuery.data, statusQuery.data, allPolicies]);

  const showLoading = mode === "search" ? searchQuery.isLoading : mode === "status" ? statusQuery.isLoading : isLoading;
  const deleteMutation = useDeletePolicy();

  const contractorName = (id: string | null) =>
    contractors?.find((c) => c.id === id)?.name ?? "-";

  const handleNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (policy: Policy) => {
    setEditing(policy);
    setDialogOpen(true);
  };

  const handleDelete = async (policy: Policy) => {
    try {
      await deleteMutation.mutateAsync(policy.id);
      toast.success("Poliza desactivada");
    } catch (err) {
      toast.error("Error al desactivar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="app-page">
      <div className="flex items-center justify-between">
        <div className="app-page-header">
          <h1 className="app-page-title">Polizas</h1>
          <p className="app-page-lead">Contratos de seguro y condiciones</p>
        </div>
        <Button onClick={handleNew} className="pg-btn-platinum">
          <Plus className="size-4" />
          Nuevo
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por numero de poliza..."
            aria-label="Buscar por numero de poliza"
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
          <SelectTrigger className="app-input h-7 w-40">
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
              <TableHead>Titular</TableHead>
              <TableHead>Contratista</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Termino</TableHead>
              <TableHead>Efectiva</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showLoading && (
              <TableRow>
                <TableCell colSpan={10} className="text-muted-foreground text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!showLoading && policies.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <FileText className="size-8 opacity-40" />
                    <p>No se encontraron polizas</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!showLoading &&
              policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-mono font-medium">{policy.policy_number}</TableCell>
                  <TableCell>{policy.holder_name}</TableCell>
                  <TableCell>{contractorName(policy.contractor_id)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(policy.start_date)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(policy.end_date)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(policy.effective_date)}</TableCell>
                  <TableCell>{policy.version}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{policy.contract_type}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[policy.status]}>
                      {STATUS_LABELS[policy.status] ?? policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/polizas/${policy.id}`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(policy)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(policy)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <PolicyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        policy={editing}
      />
    </div>
  );
}
