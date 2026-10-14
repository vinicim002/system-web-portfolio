import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  // Rotas traduzidas: a chave é a rota interna (pastas em src/app/[locale])
  pathnames: {
    "/": "/",
    "/sobre": { pt: "/sobre", en: "/about" },
    "/projetos": { pt: "/projetos", en: "/projects" },
    "/projetos/[slug]": { pt: "/projetos/[slug]", en: "/projects/[slug]" },
    "/contato": { pt: "/contato", en: "/contact" },
  },
});
