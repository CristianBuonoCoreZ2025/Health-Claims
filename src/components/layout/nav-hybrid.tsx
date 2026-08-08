"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { useNavLinks } from "@/hooks/use-nav-links";
import { useFlyoutPosition } from "@/hooks/use-flyout-position";
import type { NavLink, VisibleNavGroup, NavSubgroup } from "@/components/layout/nav-data";

const flyoutBase =
  "absolute left-full z-50 w-64 rounded-[var(--radius)] border border-[var(--glass-border)] bg-popover p-2 shadow-[var(--shadow-dropdown)] backdrop-blur-lg animate-in fade-in slide-in-from-left-2 duration-150";

function SubFlyout({
  subgroup,
  pathname,
  onNavigate,
}: {
  subgroup: NavSubgroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isGroupActive = subgroup.links.some((l) => pathname.startsWith(l.href));
  const Icon = subgroup.icon;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { itemRef, flyoutRef, position } = useFlyoutPosition(open);

  const handleEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), 150);
  };
  const handleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div
        ref={itemRef}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        onKeyDown={handleKeyDown}
        className={cn(
          "sidebar-item cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isGroupActive && !open && "sidebar-item-active",
          open && "rounded-r-none bg-sidebar-accent",
        )}
      >
        <Icon className="size-4.5 shrink-0" />
        <span className="flex-1 truncate">{subgroup.title}</span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
      </div>

      {open && (
        <div
          ref={flyoutRef}
          className={flyoutBase}
          style={{ top: position.top, bottom: position.bottom }}
        >
          {subgroup.links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  onNavigate?.();
                  setOpen(false);
                }}
                className={cn(
                  "sidebar-item outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive && "sidebar-item-active",
                )}
              >
                <LinkIcon className="size-4.5 shrink-0" />
                <span className="flex-1 truncate">{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GroupFlyout({
  group,
  pathname,
  onNavigate,
}: {
  group: VisibleNavGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isGroupActive = group.children.some((c) =>
    c.kind === "subgroup"
      ? c.subgroup.links.some((l) => pathname.startsWith(l.href))
      : pathname.startsWith(c.link.href),
  );
  const Icon = group.icon;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { itemRef, flyoutRef, position } = useFlyoutPosition(open);

  const handleEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), 200);
  };
  const handleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div
        ref={itemRef}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        onKeyDown={handleKeyDown}
        className={cn(
          "sidebar-item cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isGroupActive && !open && "sidebar-item-active",
          open && "rounded-r-none bg-sidebar-accent",
        )}
      >
        <Icon className="size-4.5 shrink-0" />
        <span className="flex-1 truncate">{group.title}</span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
      </div>

      {open && (
        <div
          ref={flyoutRef}
          className={flyoutBase}
          style={{ top: position.top, bottom: position.bottom }}
        >
          {group.children.map((child) => {
            if (child.kind === "link") {
              const link = child.link;
              const isActive = pathname.startsWith(link.href);
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => { onNavigate?.(); setOpen(false); }}
                  className={cn(
                    "sidebar-item outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive && "sidebar-item-active",
                  )}
                >
                  <LinkIcon className="size-4.5 shrink-0" />
                  <span className="flex-1 truncate">{link.label}</span>
                </Link>
              );
            }
            return (
              <SubFlyout
                key={child.subgroup.section}
                subgroup={child.subgroup}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function MainLinkIcon({
  link,
  pathname,
  onNavigate,
}: {
  link: NavLink;
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = pathname.startsWith(link.href);
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={cn(
        "sidebar-item outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "sidebar-item-active",
      )}
    >
      <Icon className="size-4.5 shrink-0" />
      <span className="flex-1 truncate">{link.label}</span>
    </Link>
  );
}

export function HybridNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { visibleMainLinks, visibleGroups } = useNavLinks();

  return (
    <div className="hidden lg:flex lg:h-screen lg:w-60 lg:shrink-0">
      <aside className="sidebar-glass flex h-full w-60 flex-col gap-3 p-3">
        <div className="relative z-10 flex h-full w-full flex-col gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-[var(--radius)] bg-primary/10 px-3 py-2 text-primary transition-all duration-200 hover:bg-primary/15"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold leading-tight">Health Claims</span>
              <span className="text-xs text-primary/80 leading-tight">Dashboard</span>
            </div>
          </Link>

          <div className="sidebar-divider" />

          <div className="flex w-full flex-col gap-1">
            {visibleMainLinks
              .filter((l) => l.href !== "/dashboard")
              .map((link) => (
                <MainLinkIcon
                  key={link.href}
                  link={link}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
          </div>

          <div className="sidebar-divider" />

          <div className="flex w-full flex-col gap-1">
            {visibleGroups.map((group) => (
              <GroupFlyout
                key={group.title}
                group={group}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
