import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";
import { getSession } from "@/services/auth.service";
import type { Database, Json } from "@/types";

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Faltan variables de entorno para el cliente admin.");
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("nav_menu_config")
      .select("id, config, updated_at, updated_by")
      .eq("id", 1)
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Error al leer configuracion" }, { status: 500 });
    }

    return NextResponse.json({ config: data?.config ?? null });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !Array.isArray((body as { items?: unknown }).items)) {
      return NextResponse.json({ error: "Payload invalido" }, { status: 400 });
    }

    const items = (body as { items: unknown[] }).items as Json;

    const supabase = await createSupabaseRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const admin = createAdminClient();
    const { error } = await admin
      .from("nav_menu_config")
      .upsert(
        {
          id: 1,
          config: { items },
          updated_by: user?.id ?? null,
        },
        { onConflict: "id" },
      );

    if (error) {
      return NextResponse.json({ error: "Error al guardar configuracion" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
