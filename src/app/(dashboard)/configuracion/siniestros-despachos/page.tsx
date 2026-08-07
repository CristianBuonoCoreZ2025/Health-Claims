import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosDespachosPage() {
  return <CatalogManager table="claim_dispatches" label="Despachos de siniestro" />;
}
