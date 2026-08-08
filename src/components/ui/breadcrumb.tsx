"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainLinks, navGroups } from "@/components/layout/nav-data";

function buildLabelMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const l of mainLinks) {
    map.set(l.href, l.label);
    if (l.section) map.set(l.section, l.label);
  }
  for (const g of navGroups) {
    map.set(`/${g.section}`, g.title);
    for (const sg of g.subgroups) {
      map.set(sg.section, sg.title);
      for (const l of sg.links) {
        map.set(l.href, l.label);
        const parts = l.href.split("/").filter(Boolean);
        const last = parts[parts.length - 1];
        if (last) map.set(last, l.label);
      }
    }
  }
  return map;
}

function humanize(segment: string, labels: Map<string, string>): string {
  if (segment === "dashboard") return "Inicio";
  return (
    labels.get(segment) ||
    labels.get(`/${segment}`) ||
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function useBreadcrumbItems(pathname: string) {
  const labels = useMemo(buildLabelMap, []);
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ label: "Inicio", isActive: true }];
  return parts.map((part, idx) => ({
    label: humanize(part, labels),
    isActive: idx === parts.length - 1,
  }));
}

export function Breadcrumb() {
  const pathname = usePathname();
  const items = useBreadcrumbItems(pathname);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, idx) => (
        <span key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
          <span
            className={cn(
              item.isActive ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {item.label}
          </span>
          {idx < items.length - 1 && <ChevronRight className="size-3.5 text-muted-foreground/60" />}
        </span>
      ))}
    </nav>
  );
}
