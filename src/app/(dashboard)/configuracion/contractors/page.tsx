import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function ContractorsPage() {
  return (
    <div className="app-page">
      <CatalogManager table="contractors" label="Contratantes" />
    </div>
  );
}
