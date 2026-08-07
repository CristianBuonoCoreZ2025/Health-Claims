import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosRecepcionPage() {
  return <CatalogManager table="claim_receipts" label="Recepcion de siniestro" />;
}
