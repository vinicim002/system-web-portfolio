import type { ProjectDraft } from "@/types/admin";
import type { ProjectRow } from "@/types/project";

// Rascunho em branco: projeto novo nasce rascunho, em evolução e no fim da lista
export function emptyDraft(sortOrder = 0): ProjectDraft {
  return {
    slug: "",
    title_pt: "",
    title_en: "",
    summary_pt: "",
    summary_en: "",
    content_pt: "",
    content_en: "",
    category: "",
    status: "in_progress",
    tech_stack: [],
    cover_url: "",
    gallery_urls: [],
    repo_url: "",
    demo_url: "",
    featured: false,
    published: false,
    sort_order: sortOrder,
  };
}

// Linha existente → rascunho do formulário (null vira "")
export function toDraft(row: ProjectRow): ProjectDraft {
  return {
    slug: row.slug,
    title_pt: row.title_pt,
    title_en: row.title_en,
    summary_pt: row.summary_pt ?? "",
    summary_en: row.summary_en ?? "",
    content_pt: row.content_pt ?? "",
    content_en: row.content_en ?? "",
    category: row.category ?? "",
    status: row.status,
    tech_stack: [...row.tech_stack],
    cover_url: row.cover_url ?? "",
    gallery_urls: [...row.gallery_urls],
    repo_url: row.repo_url ?? "",
    demo_url: row.demo_url ?? "",
    featured: row.featured,
    published: row.published,
    sort_order: row.sort_order,
  };
}
