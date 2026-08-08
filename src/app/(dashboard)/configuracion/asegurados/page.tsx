import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function AseguradosPage() {
  return (
    <div className="app-page">
      <PageHeader title="Asegurados" lead="Gestion de asegurados" />
      <CatalogManager table="insureds" label="Asegurados" />
    </div>
  );
}
