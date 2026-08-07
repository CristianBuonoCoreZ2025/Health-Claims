"use client";

import { useQuery } from "@tanstack/react-query";
import {
  mainLinks,
  navGroups,
  type NavLink,
  type NavGroup,
  type NavSubgroup,
  type VisibleNavGroup,
  type VisibleNavChild,
} from "@/components/layout/nav-data";
import { getNavMenuConfig, type NavMenuItem } from "@/services/nav-menu-config";

export function useNavLinks(isMobile = false) {
  const { data: menuConfig } = useQuery({
    queryKey: ["nav-menu-config"],
    queryFn: getNavMenuConfig,
    staleTime: 60_000,
    retry: false,
  });

  const linkByHref = new Map<string, NavLink>();
  for (const l of mainLinks) linkByHref.set(l.href, l);
  for (const g of navGroups) {
    for (const sg of g.subgroups) {
      for (const l of sg.links) linkByHref.set(l.href, l);
    }
  }

  const groupBySection = new Map<string, NavGroup>();
  for (const g of navGroups) groupBySection.set(g.section, g);

  const subgroupByKey = new Map<string, { group: NavGroup; subgroup: NavSubgroup }>();
  for (const g of navGroups) {
    for (const sg of g.subgroups) {
      subgroupByKey.set(sg.section, { group: g, subgroup: sg });
    }
  }

  const isLinkVisible = (link: NavLink): boolean => !isMobile || !link.hideOnMobile;
  const isGroupVisible = (g: NavGroup): boolean => !isMobile || !g.hideOnMobile;
  const isSubgroupVisible = (sg: NavSubgroup): boolean => !isMobile || !sg.hideOnMobile;

  const processLink = (
    item: NavMenuItem,
    usedKeys: Set<string>,
  ): NavLink | null => {
    if (usedKeys.has(`link:${item.key}`)) return null;
    usedKeys.add(`link:${item.key}`);
    const link = linkByHref.get(item.key);
    if (!link || !isLinkVisible(link)) return null;
    const customLabel = item.label?.trim();
    return customLabel ? { ...link, label: customLabel } : link;
  };

  const processSubgroup = (
    item: NavMenuItem,
    usedKeys: Set<string>,
  ): NavSubgroup | null => {
    if (usedKeys.has(`group:${item.key}`)) return null;
    usedKeys.add(`group:${item.key}`);
    const entry = subgroupByKey.get(item.key);
    if (!entry || !isSubgroupVisible(entry.subgroup)) return null;
    const title = item.label?.trim() || entry.subgroup.title;
    const links: NavLink[] = [];
    if (Array.isArray(item.children)) {
      for (const child of item.children) {
        if (child.type === "link") {
          const link = processLink(child, usedKeys);
          if (link) links.push(link);
        }
      }
    }
    if (links.length === 0) return null;
    return { ...entry.subgroup, title, links };
  };

  const processGroup = (
    item: NavMenuItem,
    usedKeys: Set<string>,
  ): VisibleNavGroup | null => {
    if (usedKeys.has(`group:${item.key}`)) return null;
    usedKeys.add(`group:${item.key}`);
    const group = groupBySection.get(item.key);
    if (!group || !isGroupVisible(group)) return null;
    const title = item.label?.trim() || group.title;
    const children: VisibleNavChild[] = [];
    if (Array.isArray(item.children)) {
      for (const child of item.children) {
        if (child.type === "group") {
          const sg = processSubgroup(child, usedKeys);
          if (sg) children.push({ kind: "subgroup", subgroup: sg });
        } else if (child.type === "link") {
          const link = processLink(child, usedKeys);
          if (link) children.push({ kind: "link", link });
        }
      }
    }
    if (children.length === 0) return null;
    return { title, section: group.section, icon: group.icon, children };
  };

  const usedKeys = new Set<string>();
  const visibleMainLinks: NavLink[] = [];
  const visibleGroups: VisibleNavGroup[] = [];

  if (menuConfig && Array.isArray(menuConfig.items) && menuConfig.items.length > 0) {
    for (const item of menuConfig.items) {
      if (item.type === "link") {
        const link = processLink(item, usedKeys);
        if (link) visibleMainLinks.push(link);
      } else if (item.type === "group") {
        const group = processGroup(item, usedKeys);
        if (group) visibleGroups.push(group);
      }
    }

    for (const l of mainLinks) {
      if (!usedKeys.has(`link:${l.href}`) && isLinkVisible(l)) {
        visibleMainLinks.push(l);
        usedKeys.add(`link:${l.href}`);
      }
    }
    for (const g of navGroups) {
      if (!isGroupVisible(g)) continue;
      if (usedKeys.has(`group:${g.section}`)) {
        const existing = visibleGroups.find((vg) => vg.section === g.section);
        if (existing) {
          for (const sg of g.subgroups) {
            if (!isSubgroupVisible(sg)) continue;
            if (usedKeys.has(`group:${sg.section}`)) {
              const subChild = existing.children.find(
                (c) => c.kind === "subgroup" && c.subgroup.section === sg.section,
              );
              if (subChild && subChild.kind === "subgroup") {
                for (const l of sg.links) {
                  if (!usedKeys.has(`link:${l.href}`) && isLinkVisible(l)) {
                    subChild.subgroup.links.push(l);
                    usedKeys.add(`link:${l.href}`);
                  }
                }
              }
            } else {
              const missingLinks = sg.links.filter(
                (l) => !usedKeys.has(`link:${l.href}`) && isLinkVisible(l),
              );
              if (missingLinks.length > 0) {
                existing.children.push({ kind: "subgroup", subgroup: { ...sg, links: missingLinks } });
                usedKeys.add(`group:${sg.section}`);
                for (const l of missingLinks) usedKeys.add(`link:${l.href}`);
              }
            }
          }
        }
      } else {
        const children: VisibleNavChild[] = [];
        for (const sg of g.subgroups) {
          if (!isSubgroupVisible(sg)) continue;
          const missingLinks = sg.links.filter(
            (l) => !usedKeys.has(`link:${l.href}`) && isLinkVisible(l),
          );
          if (missingLinks.length > 0) {
            children.push({ kind: "subgroup", subgroup: { ...sg, links: missingLinks } });
            usedKeys.add(`group:${sg.section}`);
            for (const l of missingLinks) usedKeys.add(`link:${l.href}`);
          }
        }
        if (children.length > 0) {
          visibleGroups.push({ title: g.title, section: g.section, icon: g.icon, children });
          usedKeys.add(`group:${g.section}`);
        }
      }
    }
  } else {
    for (const l of mainLinks) {
      if (isLinkVisible(l)) visibleMainLinks.push(l);
    }
    for (const g of navGroups) {
      if (!isGroupVisible(g)) continue;
      const children: VisibleNavChild[] = g.subgroups
        .filter(isSubgroupVisible)
        .filter((sg) => sg.links.length > 0)
        .map((sg) => ({ kind: "subgroup" as const, subgroup: sg }));
      if (children.length > 0) {
        visibleGroups.push({ title: g.title, section: g.section, icon: g.icon, children });
      }
    }
  }

  return { visibleMainLinks, visibleGroups };
}
