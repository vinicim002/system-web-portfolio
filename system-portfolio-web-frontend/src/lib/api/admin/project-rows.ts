import { normalizeSearch } from "@/lib/slugify";
import type { MoveDirection, ProjectDraft, ProjectFilters } from "@/types/admin";
import type { ProjectRow } from "@/types/project";
import { AdminServiceError } from "./errors";

// Regras puras compartilhadas pelas implementações local e Supabase do AdminProjectsService

export type ProjectColumns = Omit<ProjectRow, "id" | "created_at" | "updated_at">;

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

// Rascunho do formulário → colunas da tabela (textos vazios viram null, como no banco)
export function draftToColumns(draft: ProjectDraft): ProjectColumns {
  return {
    slug: draft.slug.trim(),
    title_pt: draft.title_pt.trim(),
    title_en: draft.title_en.trim(),
    summary_pt: emptyToNull(draft.summary_pt),
    summary_en: emptyToNull(draft.summary_en),
    content_pt: emptyToNull(draft.content_pt),
    content_en: emptyToNull(draft.content_en),
    category: draft.category === "" ? null : draft.category,
    status: draft.status,
    tech_stack: [...draft.tech_stack],
    cover_url: emptyToNull(draft.cover_url),
    gallery_urls: [...draft.gallery_urls],
    repo_url: emptyToNull(draft.repo_url),
    demo_url: emptyToNull(draft.demo_url),
    featured: draft.featured,
    published: draft.published,
    sort_order: draft.sort_order,
  };
}

// Busca sem diferenciar maiúsculas e acentos, só no título pt e en
export function matchesQuery(row: Pick<ProjectRow, "title_pt" | "title_en">, q: string | undefined): boolean {
  const query = normalizeSearch(q ?? "");
  if (!query) return true;
  return [row.title_pt, row.title_en].some((title) => normalizeSearch(title).includes(query));
}

export function matchesFilters(row: ProjectRow, filters: ProjectFilters): boolean {
  if (filters.category && row.category !== filters.category) return false;
  if (filters.status && row.status !== filters.status) return false;
  return matchesQuery(row, filters.q);
}

// Troca com o vizinho; no topo ou no fim devolve a mesma ordem
export function swapOrder(ids: string[], id: string, direction: MoveDirection): string[] {
  const index = ids.indexOf(id);
  if (index === -1) throw new AdminServiceError("not_found");
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= ids.length) return [...ids];
  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

// Coloca o projeto na posição pedida (limitada à lista) e devolve a nova ordem
export function placeAt(ids: string[], id: string, position: number): string[] {
  const others = ids.filter((item) => item !== id);
  const index = Math.min(Math.max(Math.trunc(Number.isFinite(position) ? position : others.length), 0), others.length);
  others.splice(index, 0, id);
  return others;
}

export function sameOrder(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

type PostgrestErrorLike = { code?: string; message?: string; status?: number } | null | undefined;

// Erro do banco → erro do admin (as telas traduzem o código)
export function toAdminError(error: PostgrestErrorLike): Error {
  if (!error) return new Error("unknown");
  if (error.code === "23505") return new AdminServiceError("slug_taken");
  if (error.code === "PGRST301" || error.status === 401 || /jwt expired/i.test(error.message ?? "")) {
    return new AdminServiceError("session_expired");
  }
  if (error.code === "42501") return new AdminServiceError("session_expired");
  const generic = new Error(error.message ?? "database_error");
  return generic;
}

// O id vem da URL: valor que não é UUID não existe no banco (evita erro 22P02 do Postgres)
export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
