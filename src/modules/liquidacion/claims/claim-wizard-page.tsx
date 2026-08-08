"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoverageTypes } from "@/hooks/use-coverage-types";
import { useCreateClaim } from "@/hooks/use-claims";
import { useCreateClaimDetail } from "@/hooks/use-claim-details";
import { useDiagnostics } from "@/hooks/use-diagnostics";
import { useInsuredsByPolicy } from "@/hooks/use-insureds";
import { usePolicies } from "@/hooks/use-policies";
import { useProviders } from "@/hooks/use-providers";
import { formatCurrency } from "@/utils/format";
import type { ClaimInput } from "@/schemas/claim.schema";
import type { ClaimDetailInput } from "@/schemas/claim-detail.schema";

const STEPS = ["Poliza", "Asegurado", "Prestacion", "Resumen"] as const;

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

  const canNext = () =>
    step === 0 ? Boolean(policyId) : step === 1 ? Boolean(insuredId) && Boolean(incidentDate) : step === 2 ? Boolean(serviceDate) && amount > 0 : true;

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
  const selectedPolicy = policies?.find((p) => p.id === policyId);
  const selectedInsured = insureds?.find((i) => i.id === insuredId);
  const selectedProvider = providers?.find((p) => p.id === providerId);
  const selectedDiagnostic = diagnostics?.find((d) => d.id === diagnosticId);

  return (
    <div className="app-page">
      <PageHeader title="Nuevo siniestro" lead="Complete los pasos para crear el siniestro" />

      <Tabs value={String(step)} onValueChange={(v) => setStep(Number(v))}>
        <TabsList className="w-full justify-start">
          {STEPS.map((label, i) => (
            <TabsTrigger key={label} value={String(i)} disabled={i > step} className="gap-2">
              <span className={`flex size-5 items-center justify-center rounded-full text-xs font-medium ${i < step ? "bg-primary text-primary-foreground" : i === step ? "border border-primary text-primary" : "border border-muted-foreground/25 text-muted-foreground"}`}>
                {i < step ? <Check className="size-3" /> : i + 1}
              </span>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0" className="app-card mt-4 space-y-4 p-4">
          <h2 className="app-card-title">Seleccion de poliza</h2>
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
        </TabsContent>

        <TabsContent value="1" className="app-card mt-4 space-y-4 p-4">
          <h2 className="app-card-title">Datos del asegurado e incidente</h2>
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
            <Input type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
          </div>
          <div>
            <Label>Descripcion</Label>
            <Input placeholder="Describe el incidente..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </TabsContent>

        <TabsContent value="2" className="app-card mt-4 space-y-4 p-4">
          <h2 className="app-card-title">Detalle de la prestacion</h2>
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
              <Input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Monto solicitado</Label>
            <Input type="number" step="0.01" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
            <p className="text-muted-foreground mt-1 text-sm">{formatCurrency(amount)}</p>
          </div>
          <div>
            <Label>Observacion</Label>
            <Input placeholder="Observaciones..." value={observation} onChange={(e) => setObservation(e.target.value)} />
          </div>
        </TabsContent>

        <TabsContent value="3" className="app-card mt-4 space-y-4 p-4">
          <h2 className="app-card-title">Resumen del siniestro</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Poliza</dt>
              <dd className="font-medium">{selectedPolicy?.policy_number ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Asegurado</dt>
              <dd className="font-medium">
                {selectedInsured ? `${selectedInsured.first_name} ${selectedInsured.last_name}` : "-"}
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
              <dd className="font-medium">{selectedProvider?.name ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Diagnostico</dt>
              <dd className="font-medium">{selectedDiagnostic?.code_cie10 ?? "-"}</dd>
            </div>
          </dl>
          <p className="text-muted-foreground text-sm">
            Al guardar, el siniestro se asignara automaticamente al liquidador con menos carga.
            Los documentos se pueden adjuntar despues desde el detalle.
          </p>
        </TabsContent>
      </Tabs>

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
