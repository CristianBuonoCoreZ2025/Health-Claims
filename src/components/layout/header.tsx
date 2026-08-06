"use client";

import { useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

// Header del layout autenticado: trigger de sidebar movil, toggle de tema y
// menu de usuario.
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menu de navegacion"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="flex h-14 items-center gap-2 border-b px-4">
            <ShieldCheck className="size-5 text-primary" />
            <span className="font-semibold">Health Claims</span>
          </SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
