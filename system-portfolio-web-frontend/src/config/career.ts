// Trajetória exibida no Sobre.
// ATENÇÃO: os itens com `placeholder: true` são EXEMPLOS inventados só para
// visualizar o layout (o dossiê não traz esses dados). Eles aparecem com a
// etiqueta "Exemplo" no site. Substituir pelos dados reais antes do deploy.

type Localized = { pt: string; en: string };

export type ExperienceItem = {
  role: Localized;
  company: string;
  start: string;
  // null = trabalho atual
  end: string | null;
  description: Localized;
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
    role: { pt: "Software Engineer · Full Stack", en: "Software Engineer · Full Stack" },
    company: "Empresa Exemplo",
    start: "2024",
    end: null,
    description: {
      pt: "Desenvolvimento de aplicações web com React/TypeScript e Java/Spring Boot, da modelagem do banco ao deploy.",
      en: "Building web applications with React/TypeScript and Java/Spring Boot, from database modeling to deploy.",
    },
    stack: ["React", "TypeScript", "Java", "Spring Boot", "PostgreSQL"],
    placeholder: true,
  },
  {
    role: { pt: "Desenvolvedor Front-end", en: "Front-end Developer" },
    company: "Outra Empresa Exemplo",
    start: "2022",
    end: "2024",
    description: {
      pt: "Interfaces responsivas e integração com APIs REST em produtos internos.",
      en: "Responsive interfaces and REST API integration for internal products.",
    },
    stack: ["React", "TypeScript", "Tailwind CSS"],
    placeholder: true,
  },
];

export const education: EducationItem[] = [
  {
    course: { pt: "Bacharelado em Ciência da Computação", en: "BSc in Computer Science" },
    institution: "Universidade Exemplo",
    period: "2021 — 2025",
    status: { pt: "Em andamento", en: "In progress" },
    placeholder: true,
  },
];

export const certifications: CertificationItem[] = [
  { name: "Java SE Developer", issuer: "Oracle", year: "2025", credentialUrl: null, placeholder: true },
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2025", credentialUrl: null, placeholder: true },
  { name: "Scrum Foundation", issuer: "CertiProf", year: "2024", credentialUrl: null, placeholder: true },
];
