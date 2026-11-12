import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// Cache do Next ("use cache" e páginas geradas) no Workers KV: grátis e sem cartão (o R2 exige).
// O cache de arquivos estáticos não serve: é só leitura e o "use cache" precisa gravar.
// Tag cache no D1 (grátis): guarda quando a tag "projects" foi invalidada pelo admin
// (POST /api/revalidate), para as páginas públicas serem geradas de novo com os dados atuais.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  enableCacheInterception: true,
});
