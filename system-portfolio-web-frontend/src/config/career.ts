// Trajetória exibida no Sobre.
// Fonte: currículo do autor (Curriculo_Vinicius_Vila_Nova.pdf, 2026-11).
// Itens com `placeholder: true` aparecem com a etiqueta "Exemplo" no site; use só
// para conteúdo ainda não confirmado.

type Localized = { pt: string; en: string };

export type ExperienceItem = {
  role: Localized;
  company: string;
  // "AAAA-MM"; null quando o período não foi informado
  start: string | null;
  end: string | null;
  current?: boolean;
  highlights: Localized[];
  stack: string[];
  placeholder?: boolean;
};

export type EducationItem = {
  course: Localized;
  institution: string;
  period: string;
  status: Localized;
  placeholder?: boolean;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  year: string;
  credentialUrl: string | null;
  placeholder?: boolean;
};

export const experience: ExperienceItem[] = [
  {
    role: { pt: "Desenvolvedor Full Stack", en: "Full Stack Developer" },
    company: "V2N Technology",
    start: "2026-05",
    end: null,
    current: true,
    highlights: [
      {
        pt: "Projetos sob demanda para clientes, do levantamento de requisitos ao deploy.",
        en: "On-demand projects for clients, from requirements gathering to deploy.",
      },
      {
        pt: "Criação do RookMTR e do sistema RookHub, desenvolvido em Java com Spring.",
        en: "Built RookMTR and the RookHub system, developed in Java with Spring.",
      },
      {
        pt: "Projeto desenvolvido para o cliente Zona Sul Urgente.",
        en: "Project developed for the client Zona Sul Urgente.",
      },
      {
        pt: "Radar: ferramenta de coleta de dados do Google Maps via scraper, em preparação para produção.",
        en: "Radar: a Google Maps data collection tool using a scraper, being prepared for production.",
      },
    ],
    stack: ["Java", "Spring Boot", "React", "TypeScript", "PostgreSQL"],
  },
  {
    role: {
      pt: "Bolsista de Pesquisa — Técnico de TI e Desenvolvedor Web",
      en: "Research Fellow — IT Technician and Web Developer",
    },
    company: "Projeto Fazendo Comuns (UFRJ)",
    start: "2024-02",
    end: "2025-02",
    highlights: [
      {
        pt: "Criação do site do projeto de pesquisa Fazendo Comuns, com interfaces responsivas.",
        en: "Built the website for the Fazendo Comuns research project, with responsive interfaces.",
      },
      {
        pt: "Técnico de TI da equipe: suporte aos pesquisadores em problemas de software e infraestrutura.",
        en: "Team IT technician: supporting researchers with software and infrastructure issues.",
      },
      {
        pt: "Manutenção contínua do site, com foco em performance e experiência do usuário.",
        en: "Ongoing site maintenance, focused on performance and user experience.",
      },
    ],
    stack: [],
  },
  {
    role: { pt: "Desenvolvedor Freelancer", en: "Freelance Developer" },
    company: "Freelancer",
    start: null,
    end: null,
    highlights: [
      {
        pt: "Aplicações web em React/Next.js e automações em Python e n8n para clientes diversos.",
        en: "Web applications in React/Next.js and automations in Python and n8n for various clients.",
      },
      {
        pt: "Manutenção do site institucional desidades.ufrj.br em WordPress, com ajustes de tema, CSS e cache (LiteSpeed Cache).",
        en: "Maintenance of the institutional website desidades.ufrj.br on WordPress, adjusting theme, CSS and cache (LiteSpeed Cache).",
      },
    ],
    stack: ["React", "Next.js", "Python", "n8n", "WordPress"],
  },
];

export const education: EducationItem[] = [
  {
    course: { pt: "Bacharelado em Engenharia da Computação", en: "BSc in Computer Engineering" },
    institution: "Universidade Veiga de Almeida (UVA)",
    period: "2026",
    status: { pt: "Conclusão", en: "Graduation" },
  },
];

export const certifications: CertificationItem[] = [
  { name: "React JS 19 e Next.js 15", issuer: "Udemy", year: "2026", credentialUrl: null },
  { name: "JavaScript e TypeScript do básico ao avançado", issuer: "Udemy", year: "2026", credentialUrl: null },
  { name: "Programação em C do básico ao avançado", issuer: "Udemy", year: "2026", credentialUrl: null },
  { name: "Excel completo do básico ao avançado", issuer: "Udemy", year: "2026", credentialUrl: null },
  { name: "NLW Connect — Fullstack", issuer: "Rocketseat", year: "2025", credentialUrl: null },
  { name: "NLW Pocket: Mobile — React Native", issuer: "Rocketseat", year: "2024", credentialUrl: null },
  { name: "Pacote Office — Microsoft Office Essencial", issuer: "Udemy", year: "2023", credentialUrl: null },
];

export const languages: { name: Localized; level: Localized }[] = [
  { name: { pt: "Português", en: "Portuguese" }, level: { pt: "Nativo", en: "Native" } },
  { name: { pt: "Inglês", en: "English" }, level: { pt: "Intermediário", en: "Intermediate" } },
];
