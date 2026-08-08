import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosPage() {
  return (
    <div className="app-page">
      <PageHeader title="Siniestros" lead="Gestion de siniestros" />
      <CatalogManager table="claims" label="Siniestros" />
    </div>
  );
}
