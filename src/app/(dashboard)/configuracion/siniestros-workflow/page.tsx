import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosWorkflowPage() {
  return <CatalogManager table="claim_workflow_stages" label="Etapas de workflow" />;
}
