"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { providerSchema, type ProviderInput } from "@/schemas/provider.schema";
import { useCreateProvider, useUpdateProvider } from "@/hooks/use-providers";
import type { Provider } from "@/types";

interface ProviderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: Provider | null;
}

export function ProviderFormDialog({ open, onOpenChange, provider }: ProviderFormDialogProps) {
  const isEdit = Boolean(provider);
  const createMutation = useCreateProvider();
  const updateMutation = useUpdateProvider();

  const form = useForm<ProviderInput>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      rut: provider?.rut ?? "",
      name: provider?.name ?? "",
      business_name: provider?.business_name ?? "",
      specialty: provider?.specialty ?? "",
      email: provider?.email ?? "",
      phone: provider?.phone ?? "",
      bank_account: provider?.bank_account ?? "",
      bank_id: provider?.bank_id ?? "",
      is_active: provider?.is_active ?? true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: ProviderInput = {
      ...values,
      business_name: values.business_name || undefined,
      specialty: values.specialty || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      bank_account: values.bank_account || undefined,
      bank_id: values.bank_id || undefined,
    };
    try {
      if (isEdit && provider) {
        await updateMutation.mutateAsync({ id: provider.id, input: payload });
        toast.success("Prestador actualizado");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Prestador creado");
      }
      onOpenChange(false);
      form.reset();
    } catch (err) {
      toast.error("Error al guardar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar prestador" : "Nuevo prestador"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifica los datos del prestador." : "Registra un nuevo prestador de salud."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUT</FormLabel>
                    <FormControl>
                      <Input placeholder="12.345.678-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Clinica Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razon social</FormLabel>
                  <FormControl>
                    <Input placeholder="Clinica Example S.A." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Hospitalizacion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input placeholder="+56 2 1234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contacto@clinica.cl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bank_account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuenta bancaria</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bank_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banco</FormLabel>
                    <FormControl>
                      <Input placeholder="Banco de Chile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isEdit ? "Guardar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
