import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosRecepcionPage() {
  return (
    <div className="app-page">
      <PageHeader
        title="Recepcion de siniestro"
        lead="Gestion de recepcion de siniestro"
      />
      <CatalogManager table="claim_receipts" label="Recepcion de siniestro" />
    </div>
  );
}
