import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosWorkflowPage() {
  return (
    <div className="app-page">
      <PageHeader title="Etapas de workflow" lead="Gestion de etapas de workflow" />
      <CatalogManager table="claim_workflow_stages" label="Etapas de workflow" />
    </div>
  );
}
