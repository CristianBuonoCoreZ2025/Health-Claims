import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-muted-foreground text-sm">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">
        Pagina no encontrada
      </h1>
      <p className="text-muted-foreground max-w-md text-sm">
        La ruta que buscas no existe o fue movida.
      </p>
      <Button asChild>
        <Link href="/dashboard">Volver al dashboard</Link>
      </Button>
    </div>
  );
}
