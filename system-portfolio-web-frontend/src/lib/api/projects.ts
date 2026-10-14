import type { Locale } from "next-intl";
import type { ProjectDetail, ProjectRow, ProjectSummary } from "@/types/project";

// TODO (etapa 4): substituir o mock por consulta ao Supabase.
// Os componentes nunca acessam o Supabase direto: sempre por aqui.
// Conteúdo baseado no dossiê de carreira; nada aqui deve ser inventado.
// TODO: confirmar status e stack dos projetos com tech_stack vazio (não constam no dossiê)
const mockProjects: ProjectRow[] = [
  {
    ...baseRow("rookhub", 1),
    title_pt: "RookHub",
    title_en: "RookHub",
    summary_pt: "Plataforma SaaS de gestão de frotas: telemetria, mapas, manutenção e indicadores.",
    summary_en: "Fleet management SaaS: telemetry, maps, maintenance and KPIs.",
    content_pt: `O RookHub é uma plataforma SaaS de gestão de frotas desenvolvida para unificar dados operacionais, manutenção, telemetria, mapas, jornada e indicadores gerenciais. O projeto combina uma interface React/TypeScript com backend Java/Spring Boot, PostgreSQL/TimescaleDB, autenticação JWT e recursos de visualização de dados e geolocalização.

## O problema

Informações e processos de operação de frota costumam ficar espalhados entre sistemas distintos. O RookHub centraliza esses dados para apoiar gestores e operadores no dia a dia.

## Funcionalidades

- Mapa ao vivo com filtro por filial e melhoria de rotas e pontos de parada.
- Jornada de trabalho com destaque de exceções para veículos que ultrapassam limites operacionais.
- Módulos de manutenção, nota fiscal e checklist.
- Tela do operário com multas, abastecimento e clientes.
- Dashboards, gráficos, indicadores e alertas para tomada de decisão.
- Carga e atualização de dados por arquivos Excel.
- Integrações com telemetria, multas, abastecimento, câmera e nota fiscal.

## Decisões técnicas

- Segmentação por filial considerada desde o desenho da solução, para evitar retrabalho.
- TimescaleDB para séries temporais de telemetria sobre o PostgreSQL.
- Spring Security com OAuth2 Resource Server e JWT para autenticação e autorização.`,
    content_en: `RookHub is a fleet management SaaS platform built to unify operational data, maintenance, telemetry, maps, work shifts and management KPIs. It combines a React/TypeScript interface with a Java/Spring Boot backend, PostgreSQL/TimescaleDB, JWT authentication and data visualization and geolocation features.

## The problem

Fleet operation data and processes are usually scattered across different systems. RookHub centralizes them to support managers and operators day to day.

## Features

- Live map filtered by branch, with improved routes and stops.
- Work shift tracking highlighting vehicles that exceed operational limits.
- Maintenance, invoice and checklist modules.
- Operator screen with fines, fueling and customers.
- Dashboards, charts, KPIs and alerts for decision making.
- Data loading and updates through Excel files.
- Integrations with telemetry, fines, fueling, cameras and invoices.

## Technical decisions

- Branch segmentation considered from the start of the design to avoid rework.
- TimescaleDB for telemetry time series on top of PostgreSQL.
- Spring Security with OAuth2 Resource Server and JWT for authentication and authorization.`,
    category: "web",
    status: "in_progress",
    tech_stack: ["React", "TypeScript", "Java", "Spring Boot", "PostgreSQL", "TimescaleDB"],
    cover_url: img("rookhub", "dashboard"),
    gallery_urls: [img("rookhub", "hub-ia"), img("rookhub", "assistente-voz"), img("rookhub", "login")],
    demo_url: "https://rookhub.com.br/",
  },
  {
    ...baseRow("app-motorista", 2),
    title_pt: "RookHub · App do Motorista",
    title_en: "RookHub · Driver App",
    summary_pt: "App mobile do motorista: checklist de saída, abastecimentos e histórico do veículo.",
    summary_en: "Driver mobile app: pre-trip checklist, fueling and vehicle history.",
    content_pt: `Aplicativo mobile do ecossistema RookHub usado pelos motoristas no dia a dia. Os dados registrados no app alimentam o painel de gestão da frota.

## Funcionalidades

- Acesso por CPF e senha.
- Início com o veículo vinculado ao motorista e opção de desvincular quando troca de caminhão.
- Checklist de saída do veículo antes de deixar o pátio.
- Histórico de checklists enviados, com itens não conformes e indicação quando o caminhão foi parado.
- Registro de abastecimentos, com acompanhamento da conferência da nota pela operação.`,
    content_en: `Mobile app in the RookHub ecosystem used by drivers day to day. The data recorded in the app feeds the fleet management dashboard.

## Features

- Sign in with CPF (Brazilian ID) and password.
- Home screen with the driver's assigned vehicle and an option to unassign when switching trucks.
- Pre-trip vehicle checklist before leaving the yard.
- History of submitted checklists, with non-compliant items and a flag when the truck was stopped.
- Fueling records, tracking the operation's review of each receipt.`,
    category: "mobile",
    status: "production",
    tech_stack: [],
    cover_url: img("app-motorista", "inicio"),
    gallery_urls: [img("app-motorista", "checklists"), img("app-motorista", "abastecer"), img("app-motorista", "login")],
  },
  {
    ...baseRow("rookmtr", 3),
    title_pt: "RookMTR",
    title_en: "RookMTR",
    summary_pt: "Sistema da RookHub para MTRs: previsão, emissão em lote, cofre e portal do cliente.",
    summary_en: "RookHub system for waste manifests (MTR): forecasting, batch issuing, vault and client portal.",
    content_pt: `App do ecossistema RookHub para a gestão de MTRs (Manifestos de Transporte de Resíduos).

## Funcionalidades

- Emissão em lote: os MTRs do período saem de uma vez no portal do INEA, a partir do modelo de cada filial, com um robô no portal do órgão ambiental.
- Previsão, emissão, cofre de documentos e portal do cliente num sistema só.
- Acesso por e-mail e senha ou por link enviado por e-mail, com convite feito pelo gestor da filial.`,
    content_en: `App in the RookHub ecosystem for managing MTRs (Brazilian waste transport manifests).

## Features

- Batch issuing: all manifests for the period are issued at once on the INEA portal, based on each branch's template, using a bot on the environmental agency's portal.
- Forecasting, issuing, document vault and client portal in a single system.
- Sign in with email and password or a magic link, with invitations sent by the branch manager.`,
    category: "automation",
    status: "production",
    tech_stack: [],
    cover_url: img("rookmtr", "login"),
    demo_url: "https://rookmtr.com.br/",
  },
  {
    ...baseRow("fazendo-comuns", 4),
    title_pt: "Fazendo Comuns",
    title_en: "Fazendo Comuns",
    summary_pt: "Site do projeto de pesquisa e intervenção da UFRJ sobre o recreio nas escolas públicas.",
    summary_en: "Website for a UFRJ research and outreach project about recess in public schools.",
    content_pt: `Site do Fazendo Comuns, projeto de pesquisa e intervenção social coordenado pelo Instituto de Psicologia da UFRJ, com foco no recreio nas escolas públicas — "a educação como projeto intra e co-geracional".

## Conteúdo do site

- Apresentação do projeto, equipe, colaboradores, produções e parceiros.
- Multimídia com podcast, vídeos e fotos.
- Eventos, editoriais, notícias e livros.
- Contato com formulário e links para as redes do projeto.`,
    content_en: `Website for Fazendo Comuns, a research and social outreach project coordinated by UFRJ's Institute of Psychology, focused on recess in public schools.

## Site content

- Project overview, team, collaborators, publications and partners.
- Multimedia section with podcast, videos and photos.
- Events, editorials, news and books.
- Contact form and links to the project's social media.`,
    category: "web",
    status: "production",
    tech_stack: [],
    cover_url: img("fazendo-comuns", "home"),
    demo_url: "https://www.fazendocomuns.com.br/",
  },
  {
    ...baseRow("telecarga", 5),
    title_pt: "Telecarga Logística",
    title_en: "Telecarga Logística",
    summary_pt: "Arquitetura proposta para portal de rastreio com integração à API SSW.",
    summary_en: "Proposed architecture for a tracking portal integrated with the SSW API.",
    content_pt: `Proposta técnica e arquitetura de produto para a evolução do portal web da Telecarga Logística. Este case mostra o trabalho de transformar uma necessidade comercial em plano técnico: organizar escopo, desenhar a arquitetura e planejar a implementação.

## Escopo projetado

- Evolução do portal web com Next.js e TypeScript.
- Backend em Java e Spring Boot, com PostgreSQL.
- Spring Security com JWT, mantendo credenciais sensíveis no servidor.
- Integração com a API SSW para rastreio e dados operacionais.
- Endpoints de rastreio, coleta de eventos, agregações e auditoria.
- Histórico com filtros por período, status e destinatário.
- Suporte a múltiplos CNPJs no mesmo perfil corporativo.

## Arquitetura proposta

Cloudflare para DNS e SSL, Nginx como reverse proxy e containers Docker em VPS. O ciclo previsto inclui testes, Actuator, homologação, treinamento e entrega.`,
    content_en: `Technical proposal and product architecture for the evolution of Telecarga Logística's web portal. This case shows the work of turning a business need into a technical plan: organizing scope, designing the architecture and planning the implementation.

## Planned scope

- Web portal evolution with Next.js and TypeScript.
- Java and Spring Boot backend with PostgreSQL.
- Spring Security with JWT, keeping sensitive credentials on the server.
- Integration with the SSW API for tracking and operational data.
- Endpoints for tracking, event collection, aggregations and auditing.
- History filtered by period, status and recipient.
- Support for multiple company IDs (CNPJs) in the same corporate profile.

## Proposed architecture

Cloudflare for DNS and SSL, Nginx as reverse proxy and Docker containers on a VPS. The planned cycle includes tests, Actuator, staging, training and delivery.`,
    category: "web",
    status: "proposal",
    tech_stack: ["Next.js", "TypeScript", "Java", "Spring Boot", "PostgreSQL", "Docker"],
  },
];

// Capturas em public/images/projects/<slug>/<nome>.webp
function img(slug: string, name: string) {
  return `/images/projects/${slug}/${name}.webp`;
}

function baseRow(slug: string, sortOrder: number): ProjectRow {
  return {
    id: slug,
    slug,
    title_pt: slug,
    title_en: slug,
    summary_pt: null,
    summary_en: null,
    content_pt: null,
    content_en: null,
    category: null,
    status: "in_progress",
    tech_stack: [],
    // TODO: capas e galeria (screenshots) quando o autor enviar
    cover_url: null,
    gallery_urls: [],
    // TODO: links de repositório/demo (pendentes no dossiê)
    repo_url: null,
    demo_url: null,
    featured: true,
    published: true,
    sort_order: sortOrder,
    created_at: "2026-10-13T00:00:00Z",
    updated_at: "2026-10-13T00:00:00Z",
  };
}

function toSummary(row: ProjectRow, locale: Locale): ProjectSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: locale === "en" ? row.title_en : row.title_pt,
    summary: locale === "en" ? row.summary_en : row.summary_pt,
    category: row.category,
    status: row.status,
    techStack: row.tech_stack,
    coverUrl: row.cover_url,
    repoUrl: row.repo_url,
    demoUrl: row.demo_url,
  };
}

function toDetail(row: ProjectRow, locale: Locale): ProjectDetail {
  return {
    ...toSummary(row, locale),
    content: locale === "en" ? row.content_en : row.content_pt,
    galleryUrls: row.gallery_urls,
  };
}

function publishedProjects() {
  return mockProjects
    .filter((project) => project.published)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getProjects(locale: Locale): Promise<ProjectSummary[]> {
  return publishedProjects().map((project) => toSummary(project, locale));
}

export async function getLatestProjects(
  locale: Locale,
  limit = 4,
): Promise<ProjectSummary[]> {
  return (await getProjects(locale)).slice(0, limit);
}

export async function getProjectBySlug(
  locale: Locale,
  slug: string,
): Promise<ProjectDetail | null> {
  const row = publishedProjects().find((project) => project.slug === slug);
  return row ? toDetail(row, locale) : null;
}

export async function getProjectSlugs(): Promise<string[]> {
  return publishedProjects().map((project) => project.slug);
}
