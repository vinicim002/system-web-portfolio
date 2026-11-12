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

const worker = {
  fetch: nextHandler.fetch,

  async scheduled(_controller: unknown, env: Env, ctx: ScheduledContext) {
    ctx.waitUntil(keepSupabaseAwake(env));
  },
};

export default worker;
