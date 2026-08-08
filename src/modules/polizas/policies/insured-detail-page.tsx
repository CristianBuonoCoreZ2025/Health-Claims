"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Loader2, AlertCircle, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInsuredWithDetails } from "@/hooks/use-insureds";
import {
  useCreatePreExistingCondition,
  useDeletePreExistingCondition,
  useCreateInsuredAddress,
  useDeleteInsuredAddress,
  useCreateInsuredBankAccount,
  useDeleteInsuredBankAccount,
} from "@/hooks/use-insured-sub-entities";
import { formatRut, formatDate } from "@/utils/format";
import type { PreExistingConditionInput } from "@/schemas/pre-existing-condition.schema";
import type { InsuredAddressInput } from "@/schemas/insured-address.schema";
import type { InsuredBankAccountInput } from "@/schemas/insured-bank-account.schema";

export function InsuredDetailPage({
  policyId,
  insuredId,
}: {
  policyId: string;
  insuredId: string;
}) {
  const { data: insured, isLoading } = useInsuredWithDetails(insuredId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (!insured) {
    return (
      <div className="flex flex-col items-center gap-4 p-12">
        <p className="text-muted-foreground">Asegurado no encontrado</p>
        <Button asChild variant="outline">
          <Link href={`/polizas/${policyId}`}>
            <ArrowLeft className="mr-2 size-4" />
            Volver
          </Link>
        </Button>
      </div>
    );
  }

  const preExisting = insured.pre_existing_conditions ?? [];
  const addresses = insured.insured_addresses ?? [];
  const bankAccounts = insured.insured_bank_accounts ?? [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/polizas/${policyId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="app-page-title">
            {insured.first_name} {insured.last_name}
          </h1>
          <p className="text-muted-foreground text-sm">{formatRut(insured.rut)}</p>
        </div>
        <Badge variant={insured.is_titular ? "default" : "secondary"}>
          {insured.is_titular ? "Titular" : "Carga"}
        </Badge>
      </div>

      <Tabs defaultValue="datos">
        <TabsList>
          <TabsTrigger value="datos">Datos personales</TabsTrigger>
          <TabsTrigger value="pre-existing">
            Pre-existencias ({preExisting.length})
          </TabsTrigger>
          <TabsTrigger value="addresses">
            Direcciones ({addresses.length})
          </TabsTrigger>
          <TabsTrigger value="bank">
            Cuentas bancarias ({bankAccounts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard label="RUT" value={formatRut(insured.rut)} />
            <InfoCard label="Nombre" value={insured.first_name} />
            <InfoCard label="Apellido" value={insured.last_name} />
            <InfoCard label="Nacimiento" value={formatDate(insured.birth_date)} />
            <InfoCard label="Genero" value={insured.gender ?? "-"} className="capitalize" />
            <InfoCard label="Relacion" value={insured.relationship} className="capitalize" />
            <InfoCard label="Email" value={insured.email ?? "-"} />
            <InfoCard label="Telefono" value={insured.phone ?? "-"} />
            <InfoCard
              label="Estado"
              value={insured.is_active ? "Activo" : "Inactivo"}
            />
          </div>
        </TabsContent>

        <TabsContent value="pre-existing" className="mt-4">
          <PreExistingTab insuredId={insuredId} items={preExisting} />
        </TabsContent>

        <TabsContent value="addresses" className="mt-4">
          <AddressesTab insuredId={insuredId} items={addresses} />
        </TabsContent>

        <TabsContent value="bank" className="mt-4">
          <BankAccountsTab insuredId={insuredId} items={bankAccounts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`mt-1 font-medium ${className ?? ""}`}>{value || "-"}</p>
    </div>
  );
}

// --- Pre-existing conditions tab ---

function PreExistingTab({
  insuredId,
  items,
}: {
  insuredId: string;
  items: Array<{ id: string; name: string; description: string | null; diagnosed_date: string | null }>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createMutation = useCreatePreExistingCondition();
  const deleteMutation = useDeletePreExistingCondition();

  const handleAdd = async () => {
    if (!name) {
      toast.error("El nombre es obligatorio");
      return;
    }
    const input: PreExistingConditionInput = {
      insured_id: insuredId,
      name,
      description: description || undefined,
      is_active: true,
    };
    try {
      await createMutation.mutateAsync(input);
      toast.success("Pre-existencia anadida");
      setOpen(false);
      setName("");
      setDescription("");
    } catch (err) {
      toast.error("Error", { description: err instanceof Error ? err.message : undefined });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 size-4" />
          Anadir
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead>Diagnostico</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <AlertCircle className="size-8 opacity-40" />
                    <p>Sin pre-existencias registradas</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.description ?? "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(item.diagnosed_date)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deleteMutation.mutate(item.id);
                      toast.success("Pre-existencia eliminada");
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nueva pre-existencia</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Descripcion</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Anadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Addresses tab ---

function AddressesTab({
  insuredId,
  items,
}: {
  insuredId: string;
  items: Array<{ id: string; label: string; street: string; city: string | null; region: string | null; postal_code: string | null }>;
}) {
  const [open, setOpen] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const createMutation = useCreateInsuredAddress();
  const deleteMutation = useDeleteInsuredAddress();

  const handleAdd = async () => {
    if (!street) {
      toast.error("La direccion es obligatoria");
      return;
    }
    const input: InsuredAddressInput = {
      insured_id: insuredId,
      label: "principal",
      street,
      city: city || undefined,
      is_active: true,
    };
    try {
      await createMutation.mutateAsync(input);
      toast.success("Direccion anadida");
      setOpen(false);
      setStreet("");
      setCity("");
    } catch (err) {
      toast.error("Error", { description: err instanceof Error ? err.message : undefined });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 size-4" />
          Anadir
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Etiqueta</TableHead>
              <TableHead>Direccion</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <MapPin className="size-8 opacity-40" />
                    <p>Sin direcciones registradas</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="capitalize">{item.label}</TableCell>
                <TableCell className="font-medium">{item.street}</TableCell>
                <TableCell className="text-muted-foreground">{item.city ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deleteMutation.mutate(item.id);
                      toast.success("Direccion eliminada");
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nueva direccion</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Direccion</label>
              <Input value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Ciudad</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Anadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Bank accounts tab ---

function BankAccountsTab({
  insuredId,
  items,
}: {
  insuredId: string;
  items: Array<{ id: string; bank_name: string; account_number: string; account_type: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const createMutation = useCreateInsuredBankAccount();
  const deleteMutation = useDeleteInsuredBankAccount();

  const handleAdd = async () => {
    if (!bankName || !accountNumber) {
      toast.error("Banco y numero de cuenta son obligatorios");
      return;
    }
    const input: InsuredBankAccountInput = {
      insured_id: insuredId,
      bank_name: bankName,
      account_number: accountNumber,
      account_type: "corriente",
      is_active: true,
    };
    try {
      await createMutation.mutateAsync(input);
      toast.success("Cuenta anadida");
      setOpen(false);
      setBankName("");
      setAccountNumber("");
    } catch (err) {
      toast.error("Error", { description: err instanceof Error ? err.message : undefined });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 size-4" />
          Anadir
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banco</TableHead>
              <TableHead>Numero cuenta</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground text-center">
                  <div className="flex flex-col items-center gap-2 py-8">
                    <CreditCard className="size-8 opacity-40" />
                    <p>Sin cuentas bancarias registradas</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.bank_name}</TableCell>
                <TableCell className="font-mono">{item.account_number}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{item.account_type}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deleteMutation.mutate(item.id);
                      toast.success("Cuenta eliminada");
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nueva cuenta bancaria</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Banco</label>
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Numero de cuenta</label>
              <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Anadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
