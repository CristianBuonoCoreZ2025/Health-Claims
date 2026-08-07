import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";

export default function SiniestrosFormulariosPage() {
  return <CatalogManager table="claim_forms" label="Formularios de siniestro" />;
}
