import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosPagosPage() {
  return <CatalogManager table="claim_payments" label="Pagos de siniestro" />;
}
