"use client";

import { useState, useCallback } from "react";
import { useSyncExternalStore } from "react";
import { LogOut, Menu, Moon, Palette, Sun, Monitor } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMounted } from "@/hooks/use-mounted";
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
import { MobileNav } from "@/components/layout/mobile-nav";

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ThemeToggleCompact() {
  const { setTheme, theme } = useTheme();
  const mounted = useMounted();
  const currentIcon = mounted && theme === "dark" ? <Moon size={18} /> : <Sun size={18} />;
  const currentValue = mounted ? theme ?? "system" : "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="topbar-action dock-item" title="Tema">
          {currentIcon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={currentValue} onValueChange={setTheme}>
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

function SkinToggleCompact() {
  const skin = useSyncExternalStore(subscribeUiStyle, getUiStyleSnapshot, getUiStyleServerSnapshot);

  const handleSelect = (value: UiStyleSkin) => {
    persistUiStyleChoice(value);
    document.documentElement.setAttribute("data-ui-style", value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="topbar-action dock-item" title="Color">
          <Palette size={18} />
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
    <div className="topbar">
      <MobileNav open={mobileNavOpen} onClose={closeMobileNav} />

      <div className="topbar-inner">
        <div className="topbar-lens" aria-hidden="true" />

        <div className="topbar-left">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="topbar-hamburger"
            aria-label="Abrir menu"
          >
            <Menu />
          </button>
          <div className="topbar-avatar-btn" title={displayName}>
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-semibold border border-primary/20">
              {initials}
            </span>
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{displayName}</span>
            <span className="topbar-user-role">
              {profile?.role ? roleLabel(profile.role) : ""}
            </span>
          </div>
        </div>

        <div className="topbar-right">
          <ThemeToggleCompact />
          <SkinToggleCompact />
          <button
            type="button"
            onClick={() => void signOutClient()}
            className="topbar-action topbar-action-logout dock-item"
            title="Salir"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

