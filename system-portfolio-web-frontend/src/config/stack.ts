// Stack por área (fonte: dossiê de carreira). Só tecnologias já usadas em projetos;
// o que está em estudo fica em messages (about.studying), separado.
export const stackAreas = [
  {
    key: "backend",
    items: ["Java 21", "Spring Boot 4", "Spring Security", "Spring Data JPA", "OAuth2 + JWT", "APIs REST"],
  },
  {
    key: "frontend",
    items: ["React 19", "TypeScript", "Next.js", "Tailwind CSS", "TanStack Query", "React Hook Form + Zod", "Recharts", "MapLibre GL"],
  },
  {
    key: "data",
    items: ["PostgreSQL 17", "TimescaleDB", "Modelagem relacional"],
  },
  {
    key: "infra",
    items: ["Docker", "Nginx", "Cloudflare", "VPS"],
  },
] as const;

export const processSteps = ["discovery", "modeling", "build", "tests", "deploy"] as const;
