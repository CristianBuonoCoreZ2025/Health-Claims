import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function CompetenciasPage() {
  return (
    <div className="app-page">
      <PageHeader
        title="Competencias de liquidadores"
        lead="Gestion de competencias de liquidadores"
      />
      <CatalogManager
        table="liquidator_competencies"
        label="Competencias de liquidadores"
      />
    </div>
  );
}
