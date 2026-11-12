import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "next-intl";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { ProjectDetail, ProjectRow, ProjectSummary } from "@/types/project";
import { mockProjects } from "./projects.mock";

// Os componentes nunca acessam o Supabase direto: sempre por aqui.

// Busca os projetos publicados (cache com a tag "projects", para o admin poder invalidar ao
// salvar). Sem Supabase configurado, usa os dados locais. As seções que mostram projetos são
// geradas a cada visita (connection()) e leem este cache: ver ProjectsArchiveSection.
async function fetchPublishedRows(): Promise<ProjectRow[]> {
  "use cache";
  cacheTag("projects");
  cacheLife("hours");

  const supabase = getSupabaseClient();
  if (!supabase) {
    return mockProjects.filter((p) => p.published).sort((a, b) => a.sort_order - b.sort_order);
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Falha ao carregar projetos: ${error.message}`);
  return data as ProjectRow[];
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

export async function getProjects(locale: Locale): Promise<ProjectSummary[]> {
  return (await fetchPublishedRows()).map((project) => toSummary(project, locale));
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
  const row = (await fetchPublishedRows()).find((project) => project.slug === slug);
  return row ? toDetail(row, locale) : null;
}

export async function getProjectSlugs(): Promise<string[]> {
  return (await fetchPublishedRows()).map((project) => project.slug);
}
