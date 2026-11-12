import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Sem este arquivo, /robots.txt caía numa rota inexistente e travava o Worker no Cloudflare
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
  };
}
