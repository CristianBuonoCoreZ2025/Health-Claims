import { redirect } from "next/navigation";

import { getSession } from "@/services/auth.service";

// Pagina raiz: redirige a /dashboard si hay sesion, si no a /login.
export default async function RootPage() {
  const session = await getSession();
  redirect(session ? "/dashboard" : "/login");
}
