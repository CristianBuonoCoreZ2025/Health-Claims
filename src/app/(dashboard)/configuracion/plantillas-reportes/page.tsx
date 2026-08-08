import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function PlantillasReportesPage() {
  return (
    <div className="app-page">
      <PageHeader
        title="Plantillas de reportes"
        lead="Gestion de plantillas de reportes"
      />
      <CatalogManager table="report_templates" label="Plantillas de reportes" />
    </div>
  );
}
