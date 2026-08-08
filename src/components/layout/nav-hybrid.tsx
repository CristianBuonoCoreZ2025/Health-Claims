"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { useNavLinks } from "@/hooks/use-nav-links";
import { useFlyoutPosition } from "@/hooks/use-flyout-position";
import type { NavLink, VisibleNavGroup, NavSubgroup } from "@/components/layout/nav-data";

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
          "group/sub flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isGroupActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground font-normal",
        )}
      >
        <Icon className={cn(
          "size-3.5 shrink-0 transition-colors",
          isGroupActive ? "text-primary" : "text-muted-foreground/60 group-hover/sub:text-foreground",
        )} />
        <span className="flex-1 truncate">{subgroup.title}</span>
        <ChevronRight className="size-3 shrink-0 text-muted-foreground/50" />
      </div>

      {open && (
        <div
          ref={flyoutRef}
          className="absolute left-full z-60 w-56 rounded-[16px] bg-card shadow-xl border border-border/50 animate-in fade-in slide-in-from-left-2 duration-150"
          style={{ top: position.top, bottom: position.bottom }}
        >
          <div className="relative p-1">
            {subgroup.links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => { onNavigate?.(); setOpen(false); }}
                  className={cn(
                    "group/item flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground font-normal",
                  )}
                >
                  <LinkIcon className={cn(
                    "size-3.5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground/60 group-hover/item:text-foreground",
                  )} />
                  <span className="flex-1 truncate">{link.label}</span>
                  {isActive && <span className="h-3 w-0.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </div>
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
          "sidebar-item cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isGroupActive && !open && "sidebar-item-active",
          open && "rounded-r-none bg-card! text-primary",
        )}
      >
        <Icon className="size-4.5 shrink-0" />
        <span className="text-[11px] font-medium truncate flex-1">{group.title}</span>
        <span className={cn(
          "size-1.5 rounded-full shrink-0 transition-colors",
          isGroupActive ? "bg-primary" : "bg-muted-foreground/40",
        )} />
      </div>

      {open && (
        <div
          ref={flyoutRef}
          className="absolute left-full z-50 w-64 rounded-[20px] bg-card animate-in fade-in slide-in-from-left-2 duration-150"
          style={{ top: position.top, bottom: position.bottom }}
        >
          <div className="relative p-1">
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
                      "group/item flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all duration-150",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground font-normal",
                    )}
                  >
                    <LinkIcon className={cn(
                      "size-3.5 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground/60 group-hover/item:text-foreground",
                    )} />
                    <span className="flex-1 truncate">{link.label}</span>
                    {isActive && <span className="h-3 w-0.5 rounded-full bg-primary" />}
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
  const isActive = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={cn("sidebar-item", isActive && "sidebar-item-active")}
    >
      <Icon className="size-4.5 shrink-0" />
      <span className="text-[11px] font-medium truncate">{link.label}</span>
    </Link>
  );
}

export function HybridNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { visibleMainLinks, visibleGroups } = useNavLinks();

  return (
    <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-start lg:w-[220px] lg:shrink-0 lg:pt-2 lg:pb-2">
      <aside className="sidebar-glass flex flex-col w-[200px] flex-1 py-4 gap-3">
        <div className="relative z-10 flex flex-col w-full h-full gap-3 px-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-[14px] bg-primary/10 text-primary shrink-0 transition-all duration-200 hover:bg-primary/15"
          >
            <div className="flex size-10 items-center justify-center rounded-[12px] text-primary shrink-0 transition-all duration-200 hover:scale-105">
              <ShieldCheck className="size-7" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold leading-tight">Health Claims</span>
              <span className="text-[10px] text-primary/80 leading-tight">Dashboard</span>
            </div>
          </Link>

          <div className="sidebar-divider" />

          <div className="flex flex-col gap-1 w-full">
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

          <div className="flex flex-col gap-1 w-full">
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
