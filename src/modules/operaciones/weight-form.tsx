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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  liquidatorWeightSchema,
  type LiquidatorWeightInput,
} from "@/schemas/liquidator-weight.schema";
import {
  useCreateLiquidatorWeight,
  useUpdateLiquidatorWeight,
} from "@/hooks/use-liquidator-weights";
import type { LiquidatorWeight } from "@/types";

interface WeightFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weight?: LiquidatorWeight | null;
  liquidadores: Array<{ id: string; full_name: string }>;
  coverageTypes: Array<{ id: string; name: string }>;
}

export function WeightFormDialog({
  open,
  onOpenChange,
  weight,
  liquidadores,
  coverageTypes,
}: WeightFormDialogProps) {
  const isEdit = Boolean(weight);
  const createMutation = useCreateLiquidatorWeight();
  const updateMutation = useUpdateLiquidatorWeight();

  const form = useForm<LiquidatorWeightInput>({
    resolver: zodResolver(liquidatorWeightSchema),
    defaultValues: {
      user_id: weight?.user_id ?? "",
      coverage_type_id: weight?.coverage_type_id ?? "",
      level: weight?.level ?? "general",
      weight_value: weight?.weight_value ?? 1.0,
      is_active: weight?.is_active ?? true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: LiquidatorWeightInput = {
      ...values,
      coverage_type_id: values.coverage_type_id || undefined,
    };
    try {
      if (isEdit && weight) {
        await updateMutation.mutateAsync({ id: weight.id, input: payload });
        toast.success("Peso actualizado");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Peso creado");
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
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar peso" : "Nuevo peso"}</DialogTitle>
          <DialogDescription>
            Configura el peso de carga para asignacion de siniestros
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liquidador</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona liquidador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {liquidadores.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.full_name || "Sin nombre"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverage_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de cobertura</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="General (todas)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {coverageTypes.map((ct) => (
                        <SelectItem key={ct.id} value={ct.id}>
                          {ct.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel</FormLabel>
                    <FormControl>
                      <Input placeholder="general" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor del peso</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1.0"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
