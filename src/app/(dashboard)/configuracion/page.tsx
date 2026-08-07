import Link from "next/link";
import {
  Building2,
  Stethoscope,
  FileCode,
  Pill,
  Layers,
  ShieldCheck,
  BookOpen,
  Building,
  Users,
  GitBranch,
  FileSignature,
  User,
  Calendar,
  Repeat,
  FileText,
  FileSpreadsheet,
  Files,
  Banknote,
  Truck,
  Package,
  CheckSquare,
  List,
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
    label: "Holdings",
    description: "Grupos empresariales y tenedores de polizas",
    href: "/configuracion/holdings",
    icon: Building,
  },
  {
    label: "Contratantes",
    description: "Contratantes asociados a holdings",
    href: "/configuracion/contractors",
    icon: Users,
  },
  {
    label: "Filiales",
    description: "Sucursales y filiales por compania",
    href: "/configuracion/company-branches",
    icon: GitBranch,
  },
  {
    label: "Endosos",
    description: "Gestion de endosos y versiones de polizas",
    href: "/configuracion/endosos",
    icon: FileSignature,
  },
  {
    label: "Servicios",
    description: "Jerarquia de servicios N2/N3/N5",
    href: "/configuracion/servicios",
    icon: Layers,
  },
  {
    label: "Condiciones",
    description: "Motor de condiciones particulares de polizas",
    href: "/configuracion/condiciones",
    icon: ShieldCheck,
  },
  {
    label: "Catalogos",
    description: "Catalogos maestros y mapeos por compania",
    href: "/configuracion/catalogos",
    icon: BookOpen,
  },
  {
    label: "Asegurados",
    description: "Gestion de asegurados",
    href: "/configuracion/asegurados",
    icon: Users,
  },
  {
    label: "Siniestros",
    description: "Gestion de siniestros y workflow",
    href: "/configuracion/siniestros",
    icon: FileText,
  },
  {
    label: "Competencias",
    description: "Competencias de liquidadores por grupo de servicios",
    href: "/configuracion/competencias",
    icon: User,
  },
  {
    label: "Topes de carga",
    description: "Maximos siniestros activos por liquidador",
    href: "/configuracion/topes-liquidadores",
    icon: CheckSquare,
  },
  {
    label: "Horarios",
    description: "Horarios de atencion de liquidadores",
    href: "/configuracion/horarios",
    icon: Calendar,
  },
  {
    label: "Reglas de reasignacion",
    description: "Reglas de reasignacion de siniestros",
    href: "/configuracion/reglas-reasignacion",
    icon: Repeat,
  },
  {
    label: "Descargas masivas",
    description: "Descargas masivas del sistema",
    href: "/configuracion/descargas-masivas",
    icon: Files,
  },
  {
    label: "Plantillas de reportes",
    description: "Plantillas para generacion de reportes",
    href: "/configuracion/plantillas-reportes",
    icon: FileSpreadsheet,
  },
  {
    label: "Plantillas de documentos",
    description: "Plantillas de documentos con variables",
    href: "/configuracion/plantillas-documentos",
    icon: FileCode,
  },
  {
    label: "Documentos",
    description: "Documentos vinculados a entidades",
    href: "/configuracion/documentos",
    icon: Files,
  },
  {
    label: "Formularios de siniestro",
    description: "Formularios recibidos por siniestro",
    href: "/configuracion/siniestros-formularios",
    icon: Package,
  },
  {
    label: "Recepcion de siniestro",
    description: "Comprobantes de recepcion de siniestros",
    href: "/configuracion/siniestros-recepcion",
    icon: CheckSquare,
  },
  {
    label: "Despachos de siniestro",
    description: "Despachos y remesas de siniestros",
    href: "/configuracion/siniestros-despachos",
    icon: Truck,
  },
  {
    label: "Pagos de siniestro",
    description: "Pagos registrados por siniestro",
    href: "/configuracion/siniestros-pagos",
    icon: Banknote,
  },
  {
    label: "Workflow",
    description: "Etapas de workflow de siniestros",
    href: "/configuracion/siniestros-workflow",
    icon: List,
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
