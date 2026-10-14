import type { Locale } from "next-intl";
import type { ProjectDetail, ProjectRow, ProjectSummary } from "@/types/project";

// TODO (etapa 4): substituir o mock por consulta ao Supabase.
// Os componentes nunca acessam o Supabase direto: sempre por aqui.
// Conteúdo baseado no dossiê de carreira; nada aqui deve ser inventado.
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
  },
  {
    ...baseRow("telecarga", 2),
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
