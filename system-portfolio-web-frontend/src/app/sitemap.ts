import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteConfig } from "@/config/site";
import { getProjectSlugs } from "@/lib/api/projects";

const BASE = `https://${siteConfig.domain}`;

// Endereços públicos em pt e en (rotas traduzidas de src/i18n/routing.ts)
const PAGES = [
  { pt: "/pt", en: "/en" },
  { pt: "/pt/sobre", en: "/en/about" },
  { pt: "/pt/projetos", en: "/en/projects" },
  { pt: "/pt/contato", en: "/en/contact" },
];

function entry(pt: string, en: string): MetadataRoute.Sitemap[number] {
  return { url: BASE + pt, alternates: { languages: { "pt-BR": BASE + pt, en: BASE + en } } };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Gerado a cada pedido (os slugs vêm do cache "projects"): uma rota pré-renderizada que
  // depende desse cache travava o Worker ao ser refeita depois de uma invalidação
  await connection();
  const slugs = await getProjectSlugs();

  return [
    ...PAGES.map((page) => entry(page.pt, page.en)),
    ...slugs.map((slug) => entry(`/pt/projetos/${slug}`, `/en/projects/${slug}`)),
  ];
}
