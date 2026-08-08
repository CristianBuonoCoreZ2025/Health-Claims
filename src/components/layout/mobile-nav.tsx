"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LogOut, Palette, X, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useNavLinks } from "@/hooks/use-nav-links";
import { roleLabel } from "@/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
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
      className="mobile-nav-action"
    >
      {isDark ? <Moon className="size-4 shrink-0" /> : <Sun className="size-4 shrink-0" />}
      <span className="text-[13px] font-medium flex-1 text-left">Tema</span>
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
        <button type="button" className="mobile-nav-action">
          <Palette className="size-4 shrink-0" />
          <span className="text-[13px] font-medium flex-1 text-left">Color</span>
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
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const displayName = fullName || profile?.full_name || "Usuario";
  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "U";

  return (
    <>
      {open && <div className="mobile-nav-overlay" onClick={onClose} aria-hidden="true" />}

      <div
        className={cn("mobile-nav-drawer", open && "mobile-nav-drawer-open")}
        aria-hidden={!open}
      >
        <div className="mobile-nav-drawer-inner">
          <div className="mobile-nav-header">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-[14px] bg-primary/10 text-primary shrink-0"
            >
              <div className="flex size-9 items-center justify-center rounded-[12px] bg-primary text-primary-foreground shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold leading-tight">Health Claims</span>
                <span className="text-[10px] text-primary/70 leading-tight">Dashboard</span>
              </div>
            </Link>
            <button type="button" onClick={onClose} className="mobile-nav-close" aria-label="Cerrar menu">
              <X className="size-4" />
            </button>
          </div>

          <div className="mobile-nav-user">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold border border-primary/20">
              {initials}
            </span>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] font-medium truncate">{displayName}</span>
              <span className="text-[10px] text-muted-foreground">
                {profile?.role ? roleLabel(profile.role) : "Mi cuenta"}
              </span>
            </div>
          </div>

          <div className="mobile-nav-section mobile-nav-section-main">
            <div className="flex flex-col gap-1.5">
              {visibleMainLinks.map((link) => {
                const isActive = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "mobile-nav-link mobile-nav-link-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive && "mobile-nav-link-active"
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className="text-[15px] font-medium flex-1">{link.label}</span>
                    {isActive && <span className="h-4 w-1 rounded-full bg-primary" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {visibleGroups.length > 0 && (
            <div className="mobile-nav-section">
              <div className="flex flex-col gap-1">
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
                            "mobile-nav-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            isActive && "mobile-nav-link-active"
                          )}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span className="text-[13px] flex-1">{link.label}</span>
                        </Link>
                      );
                    });
                  }),
                )}
              </div>
            </div>
          )}

          <div className="mobile-nav-footer">
            <MobileSkinToggle />
            <MobileThemeToggle />
            <button
              type="button"
              onClick={() => void signOutClient()}
              className="mobile-nav-action mobile-nav-action-logout"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="text-[13px] font-medium flex-1 text-left">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
