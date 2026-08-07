import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function TopesLiquidadoresPage() {
  return <CatalogManager table="liquidator_load_caps" label="Topes de carga" />;
}
