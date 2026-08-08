import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function DocumentosPage() {
  return (
    <div className="app-page">
      <PageHeader title="Documentos" lead="Gestion de documentos" />
      <CatalogManager table="documents" label="Documentos" />
    </div>
  );
}
