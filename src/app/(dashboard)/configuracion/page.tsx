import Link from "next/link";
import {
  Building2,
  Stethoscope,
  FileCode,
  Pill,
  Layers,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface ConfigCard {
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CARDS: readonly ConfigCard[] = [
  {
    label: "Companias",
    description: "Gestion de companias aseguradoras y holdings",
    href: "/configuracion/companias",
    icon: Building2,
  },
  {
    label: "Prestadores",
    description: "Prestadores de salud y datos bancarios",
    href: "/configuracion/prestadores",
    icon: Stethoscope,
  },
  {
    label: "Diagnosticos",
    description: "Catalogo CIE-10 con busqueda full-text",
    href: "/configuracion/diagnosticos",
    icon: FileCode,
  },
  {
    label: "Aranceles",
    description: "Arancel de prestaciones (jerarquia 3 niveles)",
    href: "/configuracion/aranceles",
    icon: Layers,
  },
  {
    label: "Medicamentos",
    description: "Catalogo de medicamentos y farmacias",
    href: "/configuracion/medicamentos",
    icon: Pill,
  },
  {
    label: "Tipos de cobertura",
    description: "Tipos de cobertura disponibles",
    href: "/configuracion/coberturas",
    icon: ShieldCheck,
  },
  {
    label: "Catalogos",
    description: "Catalogos maestros y mapeos por compania",
    href: "/configuracion/catalogos",
    icon: BookOpen,
  },
] as const;

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuracion</h1>
        <p className="text-muted-foreground text-sm">
          Maestros y parametrizacion del sistema
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
