// Worker do Cloudflare: repassa as requisições ao Next (gerado pelo OpenNext em .open-next/)
// e roda o cron de keep-alive do Supabase. Só existe depois de `opennextjs-cloudflare build`.
// @ts-expect-error gerado no build
import { default as nextHandler } from "./.open-next/worker.js";

type Env = {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
};

type ScheduledContext = { waitUntil(promise: Promise<unknown>): void };

// Consulta leve (1 id de projeto) para o Supabase não pausar por inatividade
async function keepSupabaseAwake(env: Env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    console.warn("keep-alive: SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY não configurados");
    return;
  }
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/projects?select=id&limit=1`, {
    headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY },
  });
  console.log(`keep-alive: Supabase respondeu ${response.status}`);
}

// Endereços com extensão que existem como rota do Next (os arquivos de public/ são servidos
// antes do Worker, pelo binding de assets)
const FILE_ROUTES = new Set(["/robots.txt", "/sitemap.xml", "/icon.svg"]);

// Último pedaço do caminho com extensão (ex.: /.env, /wp-login.php, /x.xml)
function looksLikeFile(pathname: string) {
  const last = pathname.slice(pathname.lastIndexOf("/") + 1);
  return last.includes(".");
}

// Robôs de varredura pedem arquivos que não existem (/.env, /wp-login.php...). Esses caminhos
// não passam pelo proxy e travavam o Worker dentro do OpenNext ("code had hung"). Aqui eles
// recebem direto o "não encontrado" do site, com status 404.
async function handle(request: Request, env: unknown, ctx: unknown): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (!pathname.startsWith("/_next/") && !FILE_ROUTES.has(pathname) && looksLikeFile(pathname)) {
    const notFoundUrl = new URL("/pt/404", request.url);
    const page = await nextHandler.fetch(new Request(notFoundUrl, { headers: request.headers }), env, ctx);
    return new Response(request.method === "HEAD" ? null : page.body, {
      status: 404,
      headers: page.headers,
    });
  }
  return nextHandler.fetch(request, env, ctx);
}

const worker = {
  fetch: handle,

  async scheduled(_controller: unknown, env: Env, ctx: ScheduledContext) {
    ctx.waitUntil(keepSupabaseAwake(env));
  },
};

export default worker;
