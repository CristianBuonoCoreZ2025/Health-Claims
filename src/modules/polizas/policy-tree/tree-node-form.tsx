"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { policyTreeNodeSchema, type PolicyTreeNodeInput } from "@/schemas/policy-tree.schema";
import { useCreateTreeNode, useUpdateTreeNode, useDeleteTreeNode } from "@/hooks/use-policy-tree";
import type { PolicyTreeNode } from "@/types";

const LEVEL_OPTIONS = [
  { value: 10, label: "10 - Poliza" },
  { value: 20, label: "20 - Plan" },
  { value: 30, label: "30 - Tipo Cobertura" },
  { value: 31, label: "31 - Tipo Cobertura (intermedio)" },
  { value: 40, label: "40 - Cobertura" },
  { value: 50, label: "50 - Agrupacion" },
  { value: 60, label: "60 - Sub-agrupacion" },
  { value: 70, label: "70 - Prestacion" },
  { value: 80, label: "80 - Nivel adicional" },
];

const NODE_TYPES = ["poliza", "plan", "tipo_cobertura", "cobertura", "agrupacion", "subagrupacion", "prestacion"];

interface TreeNodeFormProps {
  policyId: string;
  node?: PolicyTreeNode | null;
  parentNode?: PolicyTreeNode | null;
  onClose: () => void;
}

function getDefaultValues(
  policyId: string,
  node?: PolicyTreeNode | null,
  parentNode?: PolicyTreeNode | null
): PolicyTreeNodeInput {
  return {
    policy_id: policyId,
    parent_id: node?.parent_id ?? parentNode?.id ?? null,
    level_code: node?.level_code ?? (parentNode ? parentNode.level_code + 10 : 10),
    node_type: node?.node_type ?? "",
    code: node?.code ?? null,
    name: node?.name ?? "",
    description: node?.description ?? null,
    sort_order: node?.sort_order ?? 0,
    is_active: node?.is_active ?? true,
    metadata: null,
  };
}

export function TreeNodeForm({ policyId, node, parentNode, onClose }: TreeNodeFormProps) {
  const isEdit = Boolean(node);
  const createMutation = useCreateTreeNode(policyId);
  const updateMutation = useUpdateTreeNode(policyId);
  const deleteMutation = useDeleteTreeNode(policyId);

  const form = useForm<PolicyTreeNodeInput>({
    resolver: zodResolver(policyTreeNodeSchema),
    defaultValues: getDefaultValues(policyId, node, parentNode),
  });

  useEffect(() => {
    form.reset(getDefaultValues(policyId, node, parentNode));
  }, [policyId, node, parentNode, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (isEdit && node) {
        await updateMutation.mutateAsync({ id: node.id, input: values });
        toast.success("Nodo actualizado");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Nodo creado");
      }
      onClose();
      form.reset();
    } catch (err) {
      toast.error("Error al guardar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  });

  const handleDelete = async () => {
    if (!node) return;
    try {
      await deleteMutation.mutateAsync(node.id);
      toast.success("Nodo eliminado");
      onClose();
    } catch (err) {
      toast.error("Error al eliminar", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="modal-md">
        <DialogHeader className="modal-header">
          <DialogTitle className="modal-title">
            {isEdit ? "Editar nodo" : "Nuevo nodo"}
          </DialogTitle>
          <DialogDescription>
            {parentNode ? `Nodo hijo de: ${parentNode.name}` : "Nodo raiz del arbol"}
          </DialogDescription>
        </DialogHeader>
        <div className="modal-body">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="level_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Nivel</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent side="bottom" sideOffset={0} position="popper" className="z-9999">
                          {LEVEL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
                              {opt.label}
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
                  name="node_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Tipo de nodo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={typeof field.value === "string" ? field.value : ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent side="bottom" sideOffset={0} position="popper" className="z-9999">
                          {NODE_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Codigo</FormLabel>
                      <FormControl>
                        <Input
                          className="app-input"
                          value={typeof field.value === "string" ? field.value : ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="app-field-label">Orden</FormLabel>
                      <FormControl>
                        <Input
                          className="app-input"
                          type="number"
                          value={typeof field.value === "number" ? field.value : 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="app-field-label">Nombre</FormLabel>
                    <FormControl>
                      <Input className="app-input" value={field.value} onChange={field.onChange} />
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
                    <FormLabel className="app-field-label">Descripcion</FormLabel>
                    <FormControl>
                      <Textarea
                        className="app-input"
                        value={typeof field.value === "string" ? field.value : ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="app-field-label m-0">Activo</FormLabel>
                    <FormControl>
                      <Switch checked={field.value === true} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="modal-footer">
                {isEdit && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    Eliminar
                  </Button>
                )}
                <Button type="button" variant="outline" className="pg-btn-platinum" onClick={onClose}>
                  Cerrar
                </Button>
                <Button type="submit" disabled={isPending} className="pg-btn-platinum">
                  {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
