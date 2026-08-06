import { redirect } from "next/navigation";

import { getSession } from "@/services/auth.service";
import { QueryProvider } from "@/providers/query-provider";
import { AuthHydrator } from "@/components/layout/auth-hydrator";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Layout autenticado: protege por sesion, hidrata el store de auth y renderiza
// sidebar + header. QueryProvider envuelve el contenido para TanStack Query.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <QueryProvider>
      <AuthHydrator profile={session.profile} />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </QueryProvider>
  );
}
