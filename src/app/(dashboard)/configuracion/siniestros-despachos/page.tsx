import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosDespachosPage() {
  return (
    <div className="app-page">
      <PageHeader title="Despachos de siniestro" lead="Gestion de despachos de siniestro" />
      <CatalogManager table="claim_dispatches" label="Despachos de siniestro" />
    </div>
  );
}
