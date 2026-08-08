import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function DescargasMasivasPage() {
  return (
    <div className="app-page">
      <PageHeader title="Descargas masivas" lead="Gestion de descargas masivas" />
      <CatalogManager table="batch_downloads" label="Descargas masivas" />
    </div>
  );
}
