"use client";

import { useEffect, useMemo } from "react";
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
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { policySchema, type PolicyInput } from "@/schemas/policy.schema";
import { useCreatePolicy, useUpdatePolicy, usePolicies } from "@/hooks/use-policies";
import { useCompanies } from "@/hooks/use-companies";
import { useContractors } from "@/hooks/use-contractors";
import { useBrokers } from "@/hooks/use-brokers";
import { useCompanyBranchesByCompany } from "@/hooks/use-company-branches";
import { PolicyFormFields } from "./policy-form-fields";
import type { Policy } from "@/types";

interface PolicyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy?: Policy | null;
}

function getDefaultValues(policy?: Policy | null): PolicyInput {
  return {
    company_id: policy?.company_id ?? "",
    contractor_id: policy?.contractor_id ?? null,
    policy_number: policy?.policy_number ?? "",
    endorsement_number: policy?.endorsement_number ?? "0",
    start_date: policy?.start_date ?? "",
    end_date: policy?.end_date ?? "",
    effective_date: policy?.effective_date ?? null,
    renewal_date: policy?.renewal_date ?? null,
    holder_name: policy?.holder_name ?? "",
    contract_type: policy?.contract_type ?? "individual",
    status: policy?.status ?? "pendiente",
    is_master: policy?.is_master ?? false,
    master_policy_id: policy?.master_policy_id ?? null,
    version: policy?.version ?? 1,
    is_active: policy?.is_active ?? true,
    broker_id: policy?.broker_id ?? null,
    sponsor: policy?.sponsor ?? null,
    policy_type: policy?.policy_type ?? null,
    branch_id: policy?.branch_id ?? null,
  };
}

export function PolicyFormDialog({ open, onOpenChange, policy }: PolicyFormDialogProps) {
  const isEdit = Boolean(policy);
  const createMutation = useCreatePolicy();
  const updateMutation = useUpdatePolicy();
  const { data: companies } = useCompanies();
  const { data: contractors } = useContractors();
  const { data: allPolicies } = usePolicies();
  const { data: brokers } = useBrokers();

  const form = useForm<PolicyInput>({
    resolver: zodResolver(policySchema),
    defaultValues: getDefaultValues(policy),
  });

  const companyId = form.watch("company_id");
  const { data: branches } = useCompanyBranchesByCompany(companyId ?? "");

  const masters = useMemo(
    () => (allPolicies ?? []).filter((p) => p.is_master && p.is_active && p.id !== policy?.id),
    [allPolicies, policy?.id]
  );

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(policy));
    }
  }, [open, policy, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: PolicyInput = {
      ...values,
      endorsement_number: values.endorsement_number || undefined,
    };
    try {
      if (isEdit && policy) {
        await updateMutation.mutateAsync({ id: policy.id, input: payload });
        toast.success("Poliza actualizada");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Poliza creada");
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
      <DialogContent className="modal-lg">
        <DialogHeader className="modal-header">
          <DialogTitle className="modal-title">
            {isEdit ? "Editar poliza" : "Nueva poliza"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifica los datos de la poliza." : "Registra una nueva poliza."}
          </DialogDescription>
        </DialogHeader>
        <div className="modal-body">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <PolicyFormFields
                companies={companies ?? []}
                contractors={contractors ?? []}
                masters={masters}
                brokers={brokers ?? []}
                branches={branches ?? []}
              />
              <div className="modal-footer">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cerrar
                </Button>
                <Button type="submit" disabled={isPending}>
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
