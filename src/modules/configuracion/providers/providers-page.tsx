"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Stethoscope } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import {
  useProviders,
  useDeleteProvider,
  useSearchProvidersByName,
} from "@/hooks/use-providers";
import { ProviderFormDialog } from "./provider-form";
import { formatRut } from "@/utils/format";
import type { Provider } from "@/types";

export function ProvidersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);

  const { data: allProviders, isLoading, isError, error, refetch } = useProviders();
  const searchQuery = useSearchProvidersByName(search);
  const deleteMutation = useDeleteProvider();

  const providers = useMemo(() => {
    if (search.length > 0) return searchQuery.data ?? [];
    return allProviders ?? [];
  }, [search, searchQuery.data, allProviders]);

  const showLoading = search.length > 0 ? searchQuery.isLoading : isLoading;

  if (isError) {
    return (
      <div className="app-page">
        <PageHeader title="Prestadores" lead="Prestadores de salud y datos bancarios" />
        <ErrorState
          title="Error al cargar prestadores"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const handleNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (provider: Provider) => {
    setEditing(provider);
    setDialogOpen(true);
  };

  const handleDelete = async (provider: Provider) => {
    try {
      await deleteMutation.mutateAsync(provider.id);
      toast.success("Prestador desactivado");
    } catch (err) {
      toast.error("Error al desactivar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="app-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Prestadores" lead="Prestadores de salud y datos bancarios" />
        <Button onClick={handleNew}>
          <Plus className="size-4" />
          Nuevo prestador
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nombre..."
            aria-label="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="app-input h-8 ps-input-with-icon"
          />
        </div>
      </div>

      {showLoading && <LoadingState context="table" className="app-card" />}

      {!showLoading && (
        <div className="app-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>RUT</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-24">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState
                      icon={<Stethoscope className="size-8 opacity-40" />}
                      title="No hay prestadores registrados"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell>{formatRut(provider.rut)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {provider.specialty ?? "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {provider.email ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={provider.is_active ? "default" : "secondary"}>
                        {provider.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(provider)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(provider)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ProviderFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        provider={editing}
      />
    </div>
  );
}
