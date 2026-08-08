"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CatalogManager } from "@/modules/configuracion/catalogos/catalogs-page";
import type { CatalogTable } from "@/hooks/use-catalogs";

type TabConfig = {
  value: string;
  label: string;
  table: CatalogTable;
};

const TABS: TabConfig[] = [
  { value: "grupos", label: "Grupos N2", table: "service_groups" },
  { value: "subgrupos", label: "Subgrupos N3", table: "service_subgroups" },
  { value: "prestaciones", label: "Prestaciones N5", table: "service_items" },
];

export default function ServiciosPage() {
  const [tab, setTab] = useState(TABS[0].value);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];

  return (
    <div className="app-page">
      <div className="app-page-header">
        <h1 className="app-page-title">Jerarquia de servicios</h1>
        <p className="app-page-lead">
          Grupos, subgrupos y prestaciones del catalogo de servicios
        </p>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-accent"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <CatalogManager table={active.table} label={active.label} />
    </div>
  );
}
