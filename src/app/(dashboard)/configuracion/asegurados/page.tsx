import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function AseguradosPage() {
  return (
    <div className="app-page">
      <CatalogManager table="insureds" label="Asegurados" />
    </div>
  );
}
