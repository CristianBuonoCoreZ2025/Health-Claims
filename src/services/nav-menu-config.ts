import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface NavMenuItem {
  type: "link" | "group";
  key: string;
  label?: string;
  children?: NavMenuItem[];
}

export interface NavMenuConfig {
  items: NavMenuItem[];
}

interface NavMenuConfigRow {
  id: number;
  config: NavMenuConfig | Record<string, never>;
  updated_at: string;
  updated_by: string | null;
}

export async function getNavMenuConfig(): Promise<NavMenuConfig | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("nav_menu_config")
    .select("id, config, updated_at, updated_by")
    .eq("id", 1)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as unknown as NavMenuConfigRow;
  const config = row.config as NavMenuConfig;
  if (!config || !Array.isArray(config.items) || config.items.length === 0) {
    return null;
  }
  return config;
}

export async function saveNavMenuConfig(config: NavMenuConfig): Promise<void> {
  const res = await fetch("/api/nav-menu-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: config.items }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: "Error al guardar menu" })) as { error?: string };
    throw new Error(errBody.error || "Error al guardar menu");
  }
}
