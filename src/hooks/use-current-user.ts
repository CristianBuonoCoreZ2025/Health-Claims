"use client";

import { useAuthStore } from "@/stores/auth.store";

// Hook de acceso al usuario/perfil actual desde el store de auth (cliente).
export function useCurrentUser() {
  const profile = useAuthStore((s) => s.profile);
  const hydrated = useAuthStore((s) => s.hydrated);

  return {
    profile,
    role: profile?.role ?? null,
    fullName: profile?.full_name ?? "",
    isAuthenticated: Boolean(profile),
    hydrated,
  };
}
