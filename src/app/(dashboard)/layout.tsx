import { redirect } from "next/navigation";

import { getSession } from "@/services/auth.service";
import { QueryProvider } from "@/providers/query-provider";
import { AuthHydrator } from "@/components/layout/auth-hydrator";
import { NavWrapper } from "@/components/layout/nav-wrapper";

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
      <NavWrapper>{children}</NavWrapper>
    </QueryProvider>
  );
}
