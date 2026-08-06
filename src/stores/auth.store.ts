import { create } from "zustand";

import type { Profile, Role } from "@/types";

interface AuthState {
  profile: Profile | null;
  hydrated: boolean;
  setProfile: (profile: Profile | null) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}

// Store de auth (cliente): perfil actual, rol e hidratacion.
// Se hidrata desde el Server Component del layout autenticado.
export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  hydrated: false,
  setProfile: (profile) => set({ profile }),
  setHydrated: (hydrated) => set({ hydrated }),
  reset: () => set({ profile: null, hydrated: false }),
}));

export function useCurrentRole(): Role | null {
  return useAuthStore((s) => s.profile?.role ?? null);
}
