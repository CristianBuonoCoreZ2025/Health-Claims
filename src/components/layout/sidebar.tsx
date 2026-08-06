"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  ShieldCheck,
  FileText,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Configuracion", href: "/configuracion", icon: Settings },
  { label: "Polizas", href: "/polizas", icon: FileText },
  { label: "Liquidacion", href: "/liquidacion", icon: ShieldCheck },
  { label: "Operaciones", href: "/operaciones", icon: Workflow },
] as const;

// Contenido de navegacion compartido entre sidebar desktop y sheet movil.
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            asChild
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-3 font-normal",
              active && "font-medium"
            )}
          >
            <Link href={item.href} onClick={onNavigate}>
              <Icon className="size-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

// Sidebar desktop fijo.
export function Sidebar() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 border-r md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <ShieldCheck className="size-5 text-sidebar-primary" />
        <span className="font-semibold tracking-tight">Health Claims</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
    </aside>
  );
}
