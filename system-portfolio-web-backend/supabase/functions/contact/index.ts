// Edge Function "contact": recebe o formulário do site e envia por e-mail via Resend.
// A chave do Resend fica só aqui (secrets do Supabase), nunca no navegador.
//
// Secrets necessários (supabase secrets set ...):
//   RESEND_API_KEY      chave da API do Resend
//   CONTACT_TO_EMAIL    e-mail que recebe as mensagens
//   CONTACT_FROM_EMAIL  remetente em domínio verificado no Resend,
//                       ex.: "Portfólio <contato@viniciusvilanova.com>"
//   ALLOWED_ORIGINS     origens liberadas, separadas por vírgula,
//                       ex.: "https://viniciusvilanova.com,http://localhost:3000"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const CONTACT_TO_EMAIL = Deno.env.get("CONTACT_TO_EMAIL") ?? "";
const CONTACT_FROM_EMAIL = Deno.env.get("CONTACT_FROM_EMAIL") ?? "";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Limite simples por IP (memória da instância; reinicia em cold start)
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website?: string;
};

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

// Mesmos limites do schema Zod do front (src/lib/validations/contact.ts)
function parsePayload(value: unknown): ContactPayload | null {
  if (!value || typeof value !== "object") return null;
  const { name, email, message, website } = value as Record<string, unknown>;
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") return null;

  const payload = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    website: typeof website === "string" ? website : "",
  };
  if (payload.name.length < 2 || payload.name.length > 100) return null;
  if (payload.email.length > 200 || !EMAIL_PATTERN.test(payload.email)) return null;
  if (payload.message.length < 10 || payload.message.length > 5000) return null;
  return payload;
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
  if (ALLOWED_ORIGINS.length > 0 && (!origin || !ALLOWED_ORIGINS.includes(origin))) {
    return json({ error: "forbidden_origin" }, 403, origin);
  }
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return json({ error: "not_configured" }, 500, origin);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) return json({ error: "rate_limited" }, 429, origin);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400, origin);
  }

  const payload = parsePayload(body);
  if (!payload) return json({ error: "invalid_payload" }, 400, origin);

  // Campo-armadilha preenchido: finge sucesso e não envia nada
  if (payload.website) return json({ ok: true }, 200, origin);

  const html = `
    <p><strong>Nome:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Mensagem:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: payload.email,
      subject: `Contato pelo portfólio: ${payload.name}`,
      text: `Nome: ${payload.name}\nE-mail: ${payload.email}\n\n${payload.message}`,
      html,
    }),
  });

  if (!response.ok) {
    console.error("Falha no Resend", response.status, await response.text());
    return json({ error: "send_failed" }, 502, origin);
  }

  return json({ ok: true }, 200, origin);
});
