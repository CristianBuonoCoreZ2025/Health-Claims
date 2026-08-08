"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Building2, Loader2 } from "lucide-react";
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
import { useCompanies, useDeleteCompany } from "@/hooks/use-companies";
import { useSearchCompaniesByName } from "@/hooks/use-companies";
import { CompanyFormDialog } from "./company-form";
import { formatRut } from "@/utils/format";
import type { Company } from "@/types";

export function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const { data: allCompanies, isLoading } = useCompanies();
  const searchQuery = useSearchCompaniesByName(search);
  const deleteMutation = useDeleteCompany();

  const companies = useMemo(() => {
    if (search.length > 0) return searchQuery.data ?? [];
    return allCompanies ?? [];
  }, [search, searchQuery.data, allCompanies]);

  const showLoading = search.length > 0 ? searchQuery.isLoading : isLoading;

  const handleNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditing(company);
    setDialogOpen(true);
  };

  const handleDelete = async (company: Company) => {
    try {
      await deleteMutation.mutateAsync(company.id);
      toast.success("Compania desactivada");
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
          <h1 className="app-page-title">Companias</h1>
          <p className="app-page-lead">
            Gestion de companias aseguradoras
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 size-4" />
          Nueva compania
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
            className="app-input h-7 ps-input-with-icon"
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>RUT</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!showLoading && companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Building2 className="size-8 opacity-40" />
                    <p>No hay companias registradas</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!showLoading &&
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{formatRut(company.rut)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {company.email ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {company.phone ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.is_active ? "default" : "secondary"}>
                      {company.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(company)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(company)}
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

      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={editing}
      />
    </div>
  );
}
