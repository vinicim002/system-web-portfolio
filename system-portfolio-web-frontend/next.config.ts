import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Storage do Supabase configurado no ambiente (o real ou o local do `next dev`)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;
const storageHost = supabaseUrl
  ? {
      protocol: supabaseUrl.protocol.replace(":", "") as "http" | "https",
      hostname: supabaseUrl.hostname,
      port: supabaseUrl.port,
      pathname: "/storage/v1/object/public/project-images/**",
    }
  : null;

const nextConfig: NextConfig = {
  // Impede o `next dev` de gerar AGENTS.md (regra do projeto: só .claude/)
  agentRules: false,
  cacheComponents: true,
  experimental: {
    // 404 único para endereços sem rota (src/app/global-not-found.tsx): o site tem dois
    // layouts raiz e, sem isto, esses endereços travavam o Worker no Cloudflare
    globalNotFound: true,
  },
  images: {
    // Imagens enviadas pelo admin ficam no Storage do Supabase (bucket project-images)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yxqarosyroxewbicoxkx.supabase.co",
        pathname: "/storage/v1/object/public/project-images/**",
      },
      ...(storageHost ? [storageHost] : []),
    ],
    // Só no `next dev` com o Supabase local (127.0.0.1); em produção continua bloqueado
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
