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
import { coverageTypeSchema, type CoverageTypeInput } from "@/schemas/coverage-type.schema";
import { useCreateCoverageType, useUpdateCoverageType } from "@/hooks/use-coverage-types";
import type { CoverageType } from "@/types";

interface CoverageTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coverageType?: CoverageType | null;
}

export function CoverageTypeFormDialog({
  open,
  onOpenChange,
  coverageType,
}: CoverageTypeFormDialogProps) {
  const isEdit = Boolean(coverageType);
  const createMutation = useCreateCoverageType();
  const updateMutation = useUpdateCoverageType();

  const form = useForm<CoverageTypeInput>({
    resolver: zodResolver(coverageTypeSchema),
    defaultValues: {
      name: coverageType?.name ?? "",
      description: coverageType?.description ?? "",
      is_active: coverageType?.is_active ?? true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: CoverageTypeInput = { ...values, description: values.description || undefined };
    try {
      if (isEdit && coverageType) {
        await updateMutation.mutateAsync({ id: coverageType.id, input: payload });
        toast.success("Tipo de cobertura actualizado");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Tipo de cobertura creado");
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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar tipo de cobertura" : "Nuevo tipo de cobertura"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifica el tipo de cobertura." : "Registra un nuevo tipo de cobertura."}
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
                    <Input placeholder="Hospitalizacion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Input placeholder="Cobertura de hospitalizacion" {...field} />
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
