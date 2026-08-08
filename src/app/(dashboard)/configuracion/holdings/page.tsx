import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function HoldingsPage() {
  return (
    <div className="app-page">
      <CatalogManager table="holdings" label="Holdings" />
    </div>
  );
}
