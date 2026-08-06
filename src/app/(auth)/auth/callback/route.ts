import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

// Handler de callback de OAuth/auth. Intercambia el code por sesion y redirige
// al dashboard (o a la ruta de origen si viene en `next`).
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createSupabaseRouteHandlerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const redirectUrl = new URL(next, requestUrl.origin);
  return NextResponse.redirect(redirectUrl);
}
