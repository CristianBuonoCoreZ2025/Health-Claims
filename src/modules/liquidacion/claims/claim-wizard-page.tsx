"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePolicies } from "@/hooks/use-policies";
import { useInsuredsByPolicy } from "@/hooks/use-insureds";
import { useProviders } from "@/hooks/use-providers";
import { useDiagnostics } from "@/hooks/use-diagnostics";
import { useCoverageTypes } from "@/hooks/use-coverage-types";
import { useCreateClaim } from "@/hooks/use-claims";
import { useCreateClaimDetail } from "@/hooks/use-claim-details";
import { formatCurrency } from "@/utils/format";
import type { ClaimInput } from "@/schemas/claim.schema";
import type { ClaimDetailInput } from "@/schemas/claim-detail.schema";

const STEPS = ["Poliza", "Asegurado", "Prestacion", "Documentos"] as const;

export function ClaimWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [policyId, setPolicyId] = useState("");
  const [insuredId, setInsuredId] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [providerId, setProviderId] = useState("");
  const [diagnosticId, setDiagnosticId] = useState("");
  const [coverageTypeId, setCoverageTypeId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [observation, setObservation] = useState("");

  const { data: policies } = usePolicies();
  const { data: insureds } = useInsuredsByPolicy(policyId);
  const { data: providers } = useProviders();
  const { data: diagnostics } = useDiagnostics();
  const { data: coverageTypes } = useCoverageTypes();

  const createClaimMutation = useCreateClaim();
  const createClaimDetailMutation = useCreateClaimDetail();

  const canNext = () => {
    if (step === 0) return Boolean(policyId);
    if (step === 1) return Boolean(insuredId) && Boolean(incidentDate);
    if (step === 2)
      return Boolean(serviceDate) && amount > 0;
    return true;
  };

  const handleSubmit = async () => {
    const claimInput: ClaimInput = {
      policy_id: policyId,
      insured_id: insuredId,
      incident_date: incidentDate,
      report_date: new Date().toISOString().split("T")[0],
      description: description || undefined,
      amount_requested: amount,
      status: "ingresado",
      is_active: true,
    };

    try {
      const claim = await createClaimMutation.mutateAsync(claimInput);

      if (providerId || diagnosticId || coverageTypeId) {
        const detailInput: ClaimDetailInput = {
          claim_id: claim.id,
          provider_id: providerId || undefined,
          diagnostic_id: diagnosticId || undefined,
          coverage_type_id: coverageTypeId || undefined,
          service_date: serviceDate,
          amount,
          deductible_applied: 0,
          copayment_applied: 0,
          final_reimbursement: 0,
          observation: observation || undefined,
          is_active: true,
        };
        await createClaimDetailMutation.mutateAsync(detailInput);
      }

      toast.success("Siniestro creado y asignado");
      router.push(`/liquidacion/${claim.id}`);
    } catch (err) {
      toast.error("Error al crear siniestro", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const isPending = createClaimMutation.isPending || createClaimDetailMutation.isPending;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/liquidacion")}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="app-page-title">Nuevo siniestro</h1>
          <p className="text-muted-foreground text-sm">
            Paso {step + 1} de {STEPS.length}: {STEPS[step]}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={
                i <= step
                  ? "bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-medium"
                  : "bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-sm"
              }
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </div>
            <span className={i <= step ? "font-medium text-sm" : "text-muted-foreground text-sm"}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="bg-border mx-1 h-px w-8" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-lg border p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label>Poliza</Label>
              <Select value={policyId} onValueChange={setPolicyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona poliza" />
                </SelectTrigger>
                <SelectContent>
                  {(policies ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.policy_number} - {p.holder_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Asegurado</Label>
              <Select value={insuredId} onValueChange={setInsuredId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona asegurado" />
                </SelectTrigger>
                <SelectContent>
                  {(insureds ?? []).map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.first_name} {i.last_name} ({i.rut})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha del incidente</Label>
              <Input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Descripcion</Label>
              <Input
                placeholder="Describe el incidente..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prestador</Label>
                <Select value={providerId} onValueChange={setProviderId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona prestador" />
                  </SelectTrigger>
                  <SelectContent>
                    {(providers ?? []).map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Diagnostico</Label>
                <Select value={diagnosticId} onValueChange={setDiagnosticId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona diagnostico" />
                  </SelectTrigger>
                  <SelectContent>
                    {(diagnostics ?? []).map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.code_cie10} - {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de cobertura</Label>
                <Select value={coverageTypeId} onValueChange={setCoverageTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona cobertura" />
                  </SelectTrigger>
                  <SelectContent>
                    {(coverageTypes ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fecha de prestacion</Label>
                <Input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Monto solicitado</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <p className="text-muted-foreground mt-1 text-sm">
                {formatCurrency(amount)}
              </p>
            </div>
            <div>
              <Label>Observacion</Label>
              <Input
                placeholder="Observaciones..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 font-medium">Resumen del siniestro</h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Poliza</dt>
                  <dd className="font-medium">
                    {policies?.find((p) => p.id === policyId)?.policy_number ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Asegurado</dt>
                  <dd className="font-medium">
                    {insureds?.find((i) => i.id === insuredId)?.first_name ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fecha incidente</dt>
                  <dd className="font-medium">{incidentDate || "-"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Monto solicitado</dt>
                  <dd className="font-medium">{formatCurrency(amount)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Prestador</dt>
                  <dd className="font-medium">
                    {providers?.find((p) => p.id === providerId)?.name ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Diagnostico</dt>
                  <dd className="font-medium">
                    {diagnostics?.find((d) => d.id === diagnosticId)?.code_cie10 ?? "-"}
                  </dd>
                </div>
              </dl>
            </div>
            <p className="text-muted-foreground text-sm">
              Al guardar, el siniestro se asignara automaticamente al liquidador
              con menos carga. Los documentos se pueden adjuntar despues desde
              el detalle.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => (step > 0 ? setStep(step - 1) : router.push("/liquidacion"))}
          disabled={isPending}
        >
          <ArrowLeft className="mr-2 size-4" />
          {step > 0 ? "Atras" : "Cancelar"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
            Siguiente
            <ArrowRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Guardar siniestro
          </Button>
        )}
      </div>
    </div>
  );
}
