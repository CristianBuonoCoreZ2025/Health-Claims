"use client";

import {
  mainLinks,
  navGroups,
  type NavLink,
  type VisibleNavGroup,
  type VisibleNavChild,
} from "@/components/layout/nav-data";

export function useNavLinks(isMobile = false) {
  const visibleMainLinks: NavLink[] = mainLinks.filter(
    (l) => !isMobile || !l.hideOnMobile,
  );

  const visibleGroups: VisibleNavGroup[] = navGroups
    .filter((g) => !isMobile || !g.hideOnMobile)
    .map((g) => {
      const children: VisibleNavChild[] = g.subgroups
        .filter((s) => !isMobile || !s.hideOnMobile)
        .filter((s) => s.links.length > 0)
        .map((s) => ({ kind: "subgroup" as const, subgroup: s }));
      return {
        title: g.title,
        section: g.section,
        icon: g.icon,
        children,
      };
    })
    .filter((g) => g.children.length > 0);

  return { visibleMainLinks, visibleGroups };
}
