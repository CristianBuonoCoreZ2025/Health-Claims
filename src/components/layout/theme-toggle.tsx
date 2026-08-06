"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

// Toggle de tema claro/oscuro.
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Activar tema claro" : "Activar tema oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className="size-4 scale-100 dark:scale-0" />
      <Moon className="size-4 scale-0 dark:scale-100" />
    </Button>
  );
}
