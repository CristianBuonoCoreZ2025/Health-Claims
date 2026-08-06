import Link from "next/link";
import { Users, Scale, Ban, FileSpreadsheet } from "lucide-react";

import { cn } from "@/lib/utils";

interface OpCard {
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CARDS: readonly OpCard[] = [
  {
    label: "Dashboard de Liquidadores",
    description: "Carga de trabajo actual por liquidador",
    href: "/operaciones/liquidadores",
    icon: Users,
  },
  {
    label: "Matriz de Peso",
    description: "Configuracion de pesos por cobertura y liquidador",
    href: "/operaciones/pesos",
    icon: Scale,
  },
  {
    label: "Rechazos",
    description: "Siniestros rechazados con reingreso y anulacion",
    href: "/operaciones/rechazos",
    icon: Ban,
  },
  {
    label: "Reporte de Productividad",
    description: "Exportacion de indicadores clave a Excel",
    href: "/operaciones/reportes",
    icon: FileSpreadsheet,
  },
] as const;

export default function OperacionesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Operaciones</h1>
        <p className="text-muted-foreground text-sm">
          Herramientas para supervisores y control de liquidadores
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className={cn(
                "group flex flex-col gap-3 rounded-lg border p-5 transition-colors",
                "hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <span className="font-medium group-hover:text-primary">
                  {card.label}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{card.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
