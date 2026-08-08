import { PageHeader } from "@/components/ui/page-header";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function ReglasReasignacionPage() {
  return (
    <div className="app-page">
      <PageHeader
        title="Reglas de reasignacion"
        lead="Gestion de reglas de reasignacion"
      />
      <CatalogManager table="reassignment_rules" label="Reglas de reasignacion" />
    </div>
  );
}
