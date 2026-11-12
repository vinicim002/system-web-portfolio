import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminToken } from "@/lib/api/admin/verify-admin-token";

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
  if (!token) return reply(401, { error: "unauthorized" });
  if (!(await isAdminToken(token))) return reply(403, { error: "forbidden" });

  // Expira na hora: o próximo acesso a cada seção de projetos é gerado com os dados atuais
  revalidateTag("projects", { expire: 0 });
  return reply(200, { ok: true });
}

export function GET() {
  return reply(405);
}
