import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function DescargasMasivasPage() {
  return <CatalogManager table="batch_downloads" label="Descargas masivas" />;
}
