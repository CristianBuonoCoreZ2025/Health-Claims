import { getSession } from "@/services/auth.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { roleLabel } from "@/utils/format";

// Dashboard placeholder (Fase 1). Muestra rol y estado de sesion.
// El dashboard real se implementa en la fase 9 del roadmap.
export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="app-page">
      <div className="app-page-header">
        <h1 className="app-page-title">Dashboard</h1>
        <p className="app-page-lead">
          Resumen general del sistema de liquidacion de siniestros.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Usuario</CardDescription>
            <CardTitle className="text-lg">
              {session?.profile?.full_name || "Sin nombre"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {session?.email}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Rol</CardDescription>
            <CardTitle className="text-lg">
              {session?.profile ? roleLabel(session.profile.role) : "Sin rol"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {session?.profile?.is_active ? "Cuenta activa" : "Cuenta inactiva"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Estado</CardDescription>
            <CardTitle className="text-lg">Sesion activa</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Modulo fundacion listo. Los modulos de negocio se habilitan en las
            siguientes fases.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
