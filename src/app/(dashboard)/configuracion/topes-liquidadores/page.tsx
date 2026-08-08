import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function TopesLiquidadoresPage() {
  return (
    <div className="app-page">
      <PageHeader title="Topes de carga" lead="Gestion de topes de carga" />
      <CatalogManager table="liquidator_load_caps" label="Topes de carga" />
    </div>
  );
}
