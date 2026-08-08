import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function CompanyBranchesPage() {
  return (
    <div className="app-page">
      <CatalogManager table="company_branches" label="Filiales" />
    </div>
  );
}
