import type { LucideIcon } from "lucide-react";
import {
  mainLinks,
  navGroups,
  type NavLink,
  type NavGroup,
  type NavSubgroup,
} from "@/components/layout/nav-data";
import type { NavMenuItem } from "@/services/nav-menu-config";

export interface FlatItem {
  id: string;
  type: "link" | "group";
  key: string;
  label: string;
  defaultLabel: string;
  customLabel?: string;
  icon: LucideIcon;
  depth: number;
}

export interface AvailableItem {
  type: "link" | "group";
  key: string;
  label: string;
  icon: LucideIcon;
  category: string;
}

interface NavDataEntry {
  label: string;
  icon: LucideIcon;
}

const linkEntries = new Map<string, NavDataEntry>();
const groupEntries = new Map<string, NavDataEntry>();
const subgroupEntries = new Map<string, NavDataEntry>();
const groupSubgroups = new Map<string, NavSubgroup[]>();

function buildCatalogs(): void {
  for (const l of mainLinks) {
    linkEntries.set(l.href, { label: l.label, icon: l.icon });
  }
  for (const g of navGroups) {
    groupEntries.set(g.section, { label: g.title, icon: g.icon });
    groupSubgroups.set(g.section, g.subgroups);
    for (const sg of g.subgroups) {
      subgroupEntries.set(sg.section, { label: sg.title, icon: sg.icon });
      for (const l of sg.links) {
        linkEntries.set(l.href, { label: l.label, icon: l.icon });
      }
    }
  }
}

buildCatalogs();

export function buildAvailableItems(): AvailableItem[] {
  const items: AvailableItem[] = [];
  for (const l of mainLinks) {
    items.push({ type: "link", key: l.href, label: l.label, icon: l.icon, category: "Principales" });
  }
  for (const g of navGroups) {
    items.push({ type: "group", key: g.section, label: g.title, icon: g.icon, category: "Grupos" });
    for (const sg of g.subgroups) {
      items.push({ type: "group", key: sg.section, label: sg.title, icon: sg.icon, category: "Subgrupos" });
      for (const l of sg.links) {
        items.push({ type: "link", key: l.href, label: l.label, icon: l.icon, category: "Links" });
      }
    }
  }
  return items;
}

export const ALL_AVAILABLE = buildAvailableItems();
export const ALL_AVAILABLE_MAP = new Map(ALL_AVAILABLE.map((a) => [`${a.type}:${a.key}`, a]));
export const AVAILABLE_MAP = ALL_AVAILABLE_MAP;
export const PALETTE_CATEGORIES = ["Principales", "Grupos", "Subgrupos", "Links"];

function makeFlatItem(
  type: "link" | "group",
  key: string,
  defaultLabel: string,
  icon: LucideIcon,
  depth: number,
  customLabel?: string,
): FlatItem {
  const trimmed = customLabel?.trim();
  return {
    id: `${type}:${key}`,
    type,
    key,
    defaultLabel,
    customLabel: trimmed || undefined,
    label: trimmed || defaultLabel,
    icon,
    depth,
  };
}

function getEntry(type: "link" | "group", key: string): NavDataEntry | undefined {
  if (type === "link") return linkEntries.get(key);
  return groupEntries.get(key) ?? subgroupEntries.get(key);
}

export function defaultFlatFromNavData(): FlatItem[] {
  const flat: FlatItem[] = [];
  for (const l of mainLinks) {
    flat.push(makeFlatItem("link", l.href, l.label, l.icon, 0));
  }
  for (const g of navGroups) {
    flat.push(makeFlatItem("group", g.section, g.title, g.icon, 0));
    for (const sg of g.subgroups) {
      flat.push(makeFlatItem("group", sg.section, sg.title, sg.icon, 1));
      for (const l of sg.links) {
        flat.push(makeFlatItem("link", l.href, l.label, l.icon, 2));
      }
    }
  }
  return flat;
}

export function configToFlat(config: NavMenuItem[] | null | undefined): FlatItem[] {
  if (!config || config.length === 0) return defaultFlatFromNavData();
  const flat: FlatItem[] = [];

  function processItem(item: NavMenuItem, depth: number): void {
    const avail = AVAILABLE_MAP.get(`${item.type}:${item.key}`);
    if (!avail) return;
    if (item.type === "group") {
      if (depth > 1) return;
      flat.push(makeFlatItem("group", item.key, avail.label, avail.icon, depth, item.label));
      if (Array.isArray(item.children)) {
        for (const child of item.children) {
          processItem(child, depth + 1);
        }
      }
    } else {
      flat.push(makeFlatItem("link", item.key, avail.label, avail.icon, depth, item.label));
    }
  }

  for (const item of config) {
    processItem(item, 0);
  }

  const usedKeys = new Set(flat.map((f) => f.id));
  for (const l of mainLinks) {
    if (!usedKeys.has(`link:${l.href}`)) {
      flat.push(makeFlatItem("link", l.href, l.label, l.icon, 0));
      usedKeys.add(`link:${l.href}`);
    }
  }
  for (const g of navGroups) {
    if (!usedKeys.has(`group:${g.section}`)) {
      flat.push(makeFlatItem("group", g.section, g.title, g.icon, 0));
      usedKeys.add(`group:${g.section}`);
    }
    for (const sg of g.subgroups) {
      if (!usedKeys.has(`group:${sg.section}`)) {
        flat.push(makeFlatItem("group", sg.section, sg.title, sg.icon, 1));
        usedKeys.add(`group:${sg.section}`);
      }
      for (const l of sg.links) {
        if (!usedKeys.has(`link:${l.href}`)) {
          flat.push(makeFlatItem("link", l.href, l.label, l.icon, 2));
          usedKeys.add(`link:${l.href}`);
        }
      }
    }
  }
  return flat;
}

export function flatToConfig(flat: FlatItem[]): NavMenuItem[] {
  const items: NavMenuItem[] = [];
  let i = 0;
  while (i < flat.length) {
    const row = flat[i];
    if (row.type === "group") {
      const children: NavMenuItem[] = [];
      i++;
      while (i < flat.length && flat[i].depth > row.depth) {
        const child = flat[i];
        if (child.type === "group") {
          const subChildren: NavMenuItem[] = [];
          i++;
          while (i < flat.length && flat[i].depth > child.depth) {
            const subChild = flat[i];
            const subChildLabel = subChild.customLabel && subChild.customLabel !== subChild.defaultLabel ? subChild.customLabel : undefined;
            subChildren.push({ type: "link", key: subChild.key, label: subChildLabel });
            i++;
          }
          const subLabel = child.customLabel && child.customLabel !== child.defaultLabel ? child.customLabel : undefined;
          children.push({ type: "group", key: child.key, label: subLabel, children: subChildren });
        } else {
          const childLabel = child.customLabel && child.customLabel !== child.defaultLabel ? child.customLabel : undefined;
          children.push({ type: "link", key: child.key, label: childLabel });
          i++;
        }
      }
      const label = row.customLabel && row.customLabel !== row.defaultLabel ? row.customLabel : undefined;
      items.push({ type: "group", key: row.key, label, children });
    } else {
      const linkLabel = row.customLabel && row.customLabel !== row.defaultLabel ? row.customLabel : undefined;
      items.push({ type: "link", key: row.key, label: linkLabel });
      i++;
    }
  }
  return items;
}

export function getGroupSubgroups(section: string): NavSubgroup[] {
  return groupSubgroups.get(section) ?? [];
}

export function getNavGroup(section: string): NavGroup | undefined {
  return navGroups.find((g) => g.section === section);
}

export function getNavLink(href: string): NavLink | undefined {
  return mainLinks.find((l) => l.href === href);
}

export { getEntry };
