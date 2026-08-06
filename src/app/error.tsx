"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

// Boundary de error global. Muestra mensaje y notifica via sonner.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toast.error("Ocurrio un error inesperado.", {
      description: error.message,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Algo salio mal
      </h1>
      <p className="text-muted-foreground max-w-md text-sm">
        {error.message || "Error inesperado. Intenta de nuevo."}
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
