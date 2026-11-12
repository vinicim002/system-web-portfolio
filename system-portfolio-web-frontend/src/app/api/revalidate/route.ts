import { createClient } from "@supabase/supabase-js";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// Invalida o cache dos projetos do site depois que o admin salva (spec 002, contracts/revalidacao.md).
// Não lê nem grava dados do portfólio (constituição 1.1.2, princípio III): só descarta o cache.
// Quem decide se pode é o Supabase, com o token do próprio usuário (is_admin() exige aal2).

const ALLOWED_ORIGINS = ["https://viniciusvilanova.com", "http://localhost:3000"];

function reply(status: number, body?: Record<string, unknown>) {
  return body ? NextResponse.json(body, { status }) : new NextResponse(null, { status });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const sameOrigin = origin === request.nextUrl.origin;
  if (!origin || (!sameOrigin && !ALLOWED_ORIGINS.includes(origin))) {
    return reply(401, { error: "unauthorized" });
  }

  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !key) return reply(401, { error: "unauthorized" });

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) return reply(403, { error: "forbidden" });

  // Expira na hora: o próximo acesso a cada página pública é gerado com os dados atuais
  revalidateTag("projects", { expire: 0 });
  return reply(200, { ok: true });
}

export function GET() {
  return reply(405);
}
