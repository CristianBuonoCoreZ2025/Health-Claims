import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosPagosPage() {
  return (
    <div className="app-page">
      <PageHeader title="Pagos de siniestro" lead="Gestion de pagos de siniestro" />
      <CatalogManager table="claim_payments" label="Pagos de siniestro" />
    </div>
  );
}
