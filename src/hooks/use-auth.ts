"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth.store";

// Hook de acciones de auth del lado cliente (sign out + refresh de perfil).
export function useAuth() {
  const router = useRouter();
  const reset = useAuthStore((s) => s.reset);

  async function signOutClient() {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("No se pudo cerrar la sesion. Intenta de nuevo.");
      return;
    }
    reset();
    router.replace("/login");
    router.refresh();
  }

  return { signOutClient };
}
