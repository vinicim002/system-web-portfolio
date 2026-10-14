// Dados pessoais e links do site (fonte: dossiê de carreira, 13/10/2026).
// Redes com valor null aparecem desativadas até o link real ser informado.
export const siteConfig = {
  name: "Vinicius",
  fullName: "Vinicius Vila Nova",
  domain: "viniciusvilanova.com",
  timeZone: "America/Sao_Paulo",
  avatarUrl: "/images/profile.webp" as string | null,
  // TODO: e-mail profissional ainda não confirmado (dossiê)
  email: null as string | null,
  copyrightYear: 2026,
  // TODO: adicionar o PDF do CV em /public e apontar aqui
  cvUrl: null as string | null,
  skills: ["Java", "Spring Boot", "PostgreSQL", "React", "TypeScript", "Docker"],
  social: {
    github: "https://github.com/vinicim002",
    linkedin: "https://www.linkedin.com/in/viniciusvila/",
    // TODO: informar os links reais (ou remover a rede)
    instagram: null as string | null,
    x: null as string | null,
    youtube: null as string | null,
    tiktok: null as string | null,
  },
} as const;
