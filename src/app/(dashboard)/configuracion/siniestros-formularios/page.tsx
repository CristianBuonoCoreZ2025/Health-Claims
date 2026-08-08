import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosFormulariosPage() {
  return (
    <div className="app-page">
      <PageHeader
        title="Formularios de siniestro"
        lead="Gestion de formularios de siniestro"
      />
      <CatalogManager table="claim_forms" label="Formularios de siniestro" />
    </div>
  );
}
