import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// Cache do Next ("use cache" e páginas geradas) no Workers KV: grátis e sem cartão (o R2 exige).
// O cache de arquivos estáticos não serve: é só leitura e o "use cache" precisa gravar.
// Quando o admin gravar no Supabase, somar um tag cache (D1) para invalidar ao salvar.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  enableCacheInterception: true,
});
