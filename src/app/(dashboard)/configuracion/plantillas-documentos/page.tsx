import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function PlantillasDocumentosPage() {
  return <CatalogManager table="document_templates" label="Plantillas de documentos" />;
}
