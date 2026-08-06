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
import { medicationSchema, type MedicationInput } from "@/schemas/medication.schema";
import { useCreateMedication, useUpdateMedication } from "@/hooks/use-medications";
import type { Medication } from "@/types";

interface MedicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medication?: Medication | null;
}

export function MedicationFormDialog({ open, onOpenChange, medication }: MedicationFormDialogProps) {
  const isEdit = Boolean(medication);
  const createMutation = useCreateMedication();
  const updateMutation = useUpdateMedication();

  const form = useForm<MedicationInput>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: medication?.name ?? "",
      active_ingredient: medication?.active_ingredient ?? "",
      dosage: medication?.dosage ?? "",
      presentation: medication?.presentation ?? "",
      laboratory: medication?.laboratory ?? "",
      is_active: medication?.is_active ?? true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: MedicationInput = {
      ...values,
      active_ingredient: values.active_ingredient || undefined,
      dosage: values.dosage || undefined,
      presentation: values.presentation || undefined,
      laboratory: values.laboratory || undefined,
    };
    try {
      if (isEdit && medication) {
        await updateMutation.mutateAsync({ id: medication.id, input: payload });
        toast.success("Medicamento actualizado");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Medicamento creado");
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar medicamento" : "Nuevo medicamento"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifica los datos del medicamento." : "Registra un nuevo medicamento."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Paracetamol 500mg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active_ingredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principio activo</FormLabel>
                  <FormControl>
                    <Input placeholder="Paracetamol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosis</FormLabel>
                    <FormControl>
                      <Input placeholder="500 mg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="presentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presentacion</FormLabel>
                    <FormControl>
                      <Input placeholder="Comprimido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="laboratory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Laboratorio</FormLabel>
                  <FormControl>
                    <Input placeholder="Lab. Chile S.A." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
