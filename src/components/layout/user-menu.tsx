"use client";

import { LogOut, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { roleLabel } from "@/utils/format";

// Menu de usuario en el header: muestra nombre, rol y accion de cerrar sesion.
export function UserMenu() {
  const { profile, role, fullName } = useCurrentUser();
  const { signOutClient } = useAuth();

  const initials = (fullName || profile?.full_name || "HC")
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {initials}
          </span>
          <span className="hidden text-sm font-medium sm:inline">
            {fullName || "Usuario"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-medium">{fullName || "Usuario"}</span>
          <span className="text-muted-foreground text-xs font-normal">
            {role ? roleLabel(role) : "Sin rol"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOutClient()}>
          <LogOut className="size-4" />
          Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserIcon };
