"use client";

import { useEffect, useRef } from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Moon, Palette, ShieldCheck, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useNavLinks } from "@/hooks/use-nav-links";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getUiStyleSnapshot,
  subscribeUiStyle,
  persistUiStyleChoice,
  getUiStyleServerSnapshot,
  UI_STYLE_LABELS,
  UI_STYLE_SWATCHES,
  type UiStyleSkin,
} from "@/lib/ui-style-client-store";

function MobileThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn-ghost h-10 w-full justify-start gap-3 px-3"
    >
      {isDark ? <Moon className="size-4 shrink-0" /> : <Sun className="size-4 shrink-0" />}
      <span className="text-sm font-medium">Tema</span>
    </button>
  );
}

function MobileSkinToggle() {
  const skin = useSyncExternalStore(subscribeUiStyle, getUiStyleSnapshot, getUiStyleServerSnapshot);

  const handleSelect = (value: UiStyleSkin) => {
    persistUiStyleChoice(value);
    document.documentElement.setAttribute("data-ui-style", value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="btn-ghost h-10 w-full justify-start gap-3 px-3">
          <Palette className="size-4 shrink-0" />
          <span className="text-sm font-medium">Skin</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup value={skin} onValueChange={(value) => handleSelect(value as UiStyleSkin)}>
          {(Object.keys(UI_STYLE_LABELS) as UiStyleSkin[]).map((key) => (
            <DropdownMenuRadioItem key={key} value={key} className="text-xs">
              <span
                className="mr-2 size-2.5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: UI_STYLE_SWATCHES[key] }}
              />
              <span>{UI_STYLE_LABELS[key]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { signOutClient } = useAuth();
  const { profile, fullName } = useCurrentUser();
  const { visibleMainLinks, visibleGroups } = useNavLinks(true);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !drawerRef.current) return;
    const root = drawerRef.current;
    const focusable = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusable.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    root.addEventListener("keydown", trap);
    return () => {
      root.removeEventListener("keydown", trap);
    };
  }, [open]);

  const displayName = fullName || profile?.full_name || "Usuario";
  const initials = getInitials(displayName);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[4px] transition-opacity duration-200",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegacion"
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 sidebar-glass p-4 shadow-[var(--shadow-modal)] transition-transform duration-300 ease-[var(--ease-out)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="flex h-full w-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 rounded-[var(--radius)] bg-primary/10 px-3 py-2 text-primary"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius)] text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold leading-tight">Health Claims</span>
                <span className="text-xs text-primary/80 leading-tight">Dashboard</span>
              </div>
            </Link>
            <button type="button" onClick={onClose} className="btn-ghost h-9 w-9 p-0" aria-label="Cerrar menu">
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/15 text-xs font-semibold text-primary">
              {initials}
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-medium truncate">{displayName}</span>
              <span className="text-xs text-muted-foreground">Mi cuenta</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1">
            {visibleMainLinks.map((link) => {
              const isActive = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "sidebar-item min-h-11 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive && "sidebar-item-active",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="flex-1 truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {visibleGroups.length > 0 && (
            <div className="flex w-full flex-1 flex-col gap-1 overflow-auto">
              {visibleGroups.map((group) =>
                group.children.map((child) => {
                  if (child.kind !== "subgroup") return null;
                  return child.subgroup.links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "sidebar-item min-h-11 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive && "sidebar-item-active",
                        )}
                      >
                        <Icon className="size-4.5 shrink-0" />
                        <span className="flex-1 truncate">{link.label}</span>
                      </Link>
                    );
                  });
                }),
              )}
            </div>
          )}

          <div className="mt-auto flex w-full flex-col gap-1 border-t border-[var(--glass-border)] pt-3">
            <MobileSkinToggle />
            <MobileThemeToggle />
            <button
              type="button"
              onClick={() => void signOutClient()}
              className="btn-ghost h-10 w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
