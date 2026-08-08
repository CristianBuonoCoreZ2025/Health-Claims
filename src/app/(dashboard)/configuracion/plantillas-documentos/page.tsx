import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function PlantillasDocumentosPage() {
  return (
    <div className="app-page">
      <PageHeader
        title="Plantillas de documentos"
        lead="Gestion de plantillas de documentos"
      />
      <CatalogManager
        table="document_templates"
        label="Plantillas de documentos"
      />
    </div>
  );
}
