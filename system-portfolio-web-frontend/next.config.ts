import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Impede o `next dev` de gerar AGENTS.md (regra do projeto: só .claude/)
  agentRules: false,
  cacheComponents: true,
  images: {
    // Imagens enviadas pelo admin ficam no Storage do Supabase (bucket project-images)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yxqarosyroxewbicoxkx.supabase.co",
        pathname: "/storage/v1/object/public/project-images/**",
      },
    ],
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
