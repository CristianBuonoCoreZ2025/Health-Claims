"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth.store";
import type { Profile } from "@/types";

// Hidrata el store de auth (cliente) con el perfil obtenido en el server.
export function AuthHydrator({ profile }: { profile: Profile | null }) {
  const setProfile = useAuthStore((s) => s.setProfile);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    setProfile(profile);
    setHydrated(true);
  }, [profile, setProfile, setHydrated]);

  return null;
}
