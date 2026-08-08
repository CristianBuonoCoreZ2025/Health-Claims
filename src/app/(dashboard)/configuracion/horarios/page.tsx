import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function HorariosPage() {
  return (
    <div className="app-page">
      <PageHeader
        title="Horarios de liquidadores"
        lead="Gestion de horarios de liquidadores"
      />
      <CatalogManager table="liquidator_schedules" label="Horarios de liquidadores" />
    </div>
  );
}
