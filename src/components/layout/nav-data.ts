import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Workflow,
  Settings,
  Building2,
  Building,
  Users,
  GitBranch,
  FileSignature,
  Stethoscope,
  FileCode,
  Layers,
  Pill,
  BookOpen,
  List,
  Calendar,
  Repeat,
  CheckSquare,
  Files,
  FileSpreadsheet,
  Package,
  Truck,
  Banknote,
  Scale,
  Ban,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  section?: string;
  hideOnMobile?: boolean;
}

export interface NavSubgroup {
  title: string;
  section: string;
  icon: LucideIcon;
  links: NavLink[];
  hideOnMobile?: boolean;
}

export interface NavGroup {
  title: string;
  section: string;
  icon: LucideIcon;
  subgroups: NavSubgroup[];
  hideOnMobile?: boolean;
}

export type VisibleNavChild =
  | { kind: "link"; link: NavLink }
  | { kind: "subgroup"; subgroup: NavSubgroup };

export interface VisibleNavGroup {
  title: string;
  section: string;
  icon: LucideIcon;
  children: VisibleNavChild[];
}

export const mainLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, section: "dashboard", hideOnMobile: true },
  { href: "/polizas", label: "Polizas", icon: FileText, section: "polizas" },
  { href: "/liquidacion", label: "Liquidacion", icon: ShieldCheck, section: "liquidacion" },
  { href: "/operaciones", label: "Operaciones", icon: Workflow, section: "operaciones" },
];

const companiasLinks: NavLink[] = [
  { href: "/configuracion/companias", label: "Companias", icon: Building2 },
  { href: "/configuracion/holdings", label: "Holdings", icon: Building },
  { href: "/configuracion/contractors", label: "Contratantes", icon: Users },
  { href: "/configuracion/company-branches", label: "Filiales", icon: GitBranch },
  { href: "/configuracion/endosos", label: "Endosos", icon: FileSignature },
];

const saludLinks: NavLink[] = [
  { href: "/configuracion/prestadores", label: "Prestadores", icon: Stethoscope },
  { href: "/configuracion/diagnosticos", label: "Diagnosticos", icon: FileCode },
  { href: "/configuracion/aranceles", label: "Aranceles", icon: Layers },
  { href: "/configuracion/medicamentos", label: "Medicamentos", icon: Pill },
];

const coberturasLinks: NavLink[] = [
  { href: "/configuracion/coberturas", label: "Tipos de Cobertura", icon: ShieldCheck },
  { href: "/configuracion/arbol-coberturas", label: "Arbol de Coberturas", icon: ShieldCheck },
  { href: "/configuracion/condiciones", label: "Condiciones", icon: ShieldCheck },
  { href: "/configuracion/servicios", label: "Servicios", icon: Layers },
];

const catalogosLinks: NavLink[] = [
  { href: "/configuracion/catalogos", label: "Catalogos", icon: BookOpen },
  { href: "/configuracion/asegurados", label: "Asegurados", icon: Users },
];

const siniestrosLinks: NavLink[] = [
  { href: "/configuracion/siniestros", label: "Siniestros", icon: FileText },
  { href: "/configuracion/siniestros-formularios", label: "Formularios", icon: Package },
  { href: "/configuracion/siniestros-recepcion", label: "Recepcion", icon: CheckSquare },
  { href: "/configuracion/siniestros-despachos", label: "Despachos", icon: Truck },
  { href: "/configuracion/siniestros-pagos", label: "Pagos", icon: Banknote },
  { href: "/configuracion/siniestros-workflow", label: "Workflow", icon: List },
];

const liquidadoresLinks: NavLink[] = [
  { href: "/configuracion/competencias", label: "Competencias", icon: Users },
  { href: "/configuracion/topes-liquidadores", label: "Topes de Carga", icon: CheckSquare },
  { href: "/configuracion/horarios", label: "Horarios", icon: Calendar },
  { href: "/configuracion/reglas-reasignacion", label: "Reglas de Reasignacion", icon: Repeat },
];

const documentosLinks: NavLink[] = [
  { href: "/configuracion/documentos", label: "Documentos", icon: Files },
  { href: "/configuracion/plantillas-documentos", label: "Plantillas de Documentos", icon: FileCode },
  { href: "/configuracion/plantillas-reportes", label: "Plantillas de Reportes", icon: FileSpreadsheet },
  { href: "/configuracion/descargas-masivas", label: "Descargas Masivas", icon: Files },
];

const operacionesLinks: NavLink[] = [
  { href: "/operaciones/liquidadores", label: "Dashboard de Liquidadores", icon: Users },
  { href: "/operaciones/pesos", label: "Matriz de Peso", icon: Scale },
  { href: "/operaciones/rechazos", label: "Rechazos", icon: Ban },
  { href: "/operaciones/reportes", label: "Reporte de Productividad", icon: FileSpreadsheet },
];

export const navGroups: NavGroup[] = [
  {
    title: "Configuracion",
    section: "configuracion",
    icon: Settings,
    subgroups: [
      { title: "Companias", section: "config_companias", icon: Building2, links: companiasLinks },
      { title: "Salud", section: "config_salud", icon: Stethoscope, links: saludLinks },
      { title: "Coberturas", section: "config_coberturas", icon: ShieldCheck, links: coberturasLinks },
      { title: "Catalogos", section: "config_catalogos", icon: BookOpen, links: catalogosLinks },
      { title: "Siniestros", section: "config_siniestros", icon: FileText, links: siniestrosLinks },
      { title: "Liquidadores", section: "config_liquidadores", icon: Users, links: liquidadoresLinks },
      { title: "Documentos", section: "config_documentos", icon: Files, links: documentosLinks, hideOnMobile: true },
    ],
    hideOnMobile: true,
  },
  {
    title: "Operaciones",
    section: "operaciones_group",
    icon: Workflow,
    subgroups: [
      { title: "Operaciones", section: "op_operaciones", icon: Workflow, links: operacionesLinks },
    ],
    hideOnMobile: true,
  },
];
