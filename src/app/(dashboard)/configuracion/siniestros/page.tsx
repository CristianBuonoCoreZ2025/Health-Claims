import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosPage() {
  return (
    <div className="app-page">
      <CatalogManager table="claims" label="Siniestros" />
    </div>
  );
}
