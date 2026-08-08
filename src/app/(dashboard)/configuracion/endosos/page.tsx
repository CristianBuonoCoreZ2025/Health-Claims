import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function EndososPage() {
  return (
    <div className="app-page">
      <CatalogManager table="policy_endorsements" label="Endosos" />
    </div>
  );
}
