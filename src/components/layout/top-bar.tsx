"use client";

import { useCallback, useState } from "react";
import { useSyncExternalStore } from "react";
import { LogOut, Menu, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useAuth } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMounted } from "@/hooks/use-mounted";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  getUiStyleSnapshot,
  subscribeUiStyle,
  persistUiStyleChoice,
  getUiStyleServerSnapshot,
  UI_STYLE_LABELS,
  UI_STYLE_SWATCHES,
  type UiStyleSkin,
} from "@/lib/ui-style-client-store";
import { MobileNav } from "@/components/layout/mobile-nav";

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const mounted = useMounted();
  const icon = mounted && theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="btn-ghost h-9 w-9 p-0" title="Tema" aria-label="Cambiar tema">
          {icon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={mounted ? theme ?? "system" : "system"} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="text-xs">
            <Sun className="mr-2 size-3" />
            <span>Claro</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="text-xs">
            <Moon className="mr-2 size-3" />
            <span>Oscuro</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="text-xs">
            <Monitor className="mr-2 size-3" />
            <span>Sistema</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SkinToggle() {
  const skin = useSyncExternalStore(subscribeUiStyle, getUiStyleSnapshot, getUiStyleServerSnapshot);

  const handleSelect = (value: UiStyleSkin) => {
    persistUiStyleChoice(value);
    document.documentElement.setAttribute("data-ui-style", value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="btn-ghost h-9 w-9 p-0" title="Skin" aria-label="Cambiar skin">
          <Palette className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
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

export function TopBar() {
  const { profile, fullName } = useCurrentUser();
  const { signOutClient } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  const displayName = fullName || profile?.full_name || "Usuario";
  const initials = getInitials(displayName);

  return (
    <>
      <MobileNav open={mobileNavOpen} onClose={closeMobileNav} />
      <header className="sticky top-0 z-50 h-14 w-full border-b border-(--glass-border) bg-[color-mix(in_srgb,var(--card)_72%,transparent)] backdrop-blur-[18px] shadow-(--shadow-float)">
        <div className="flex h-full w-full items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="btn-ghost h-9 w-9 p-0 md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-4" />
            </button>
            <div className="hidden md:block">
              <Breadcrumb />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeToggle />
            <SkinToggle />
            <div className="btn-ghost hidden h-9 items-center gap-2 px-2 sm:flex">
              <span className="flex size-7 items-center justify-center rounded-full border border-primary/20 bg-primary/15 text-[10px] font-semibold text-primary">
                {initials}
              </span>
              <span className="max-w-30 truncate text-sm font-medium">{displayName}</span>
            </div>
            <button
              type="button"
              onClick={() => void signOutClient()}
              className="btn-ghost h-9 w-9 p-0"
              title="Salir"
              aria-label="Cerrar sesion"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
