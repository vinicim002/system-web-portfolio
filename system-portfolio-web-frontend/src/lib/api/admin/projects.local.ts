import { mockProjects } from "@/lib/api/projects.mock";
import { normalizeSearch } from "@/lib/slugify";
import type { MoveDirection, ProjectDraft } from "@/types/admin";
import type { ProjectRow } from "@/types/project";
import { AdminServiceError } from "./errors";
import type { AdminProjectsService } from "./projects";

const DEFAULT_DELAY_MS = 150;

type Options = {
  initial?: ProjectRow[];
  delayMs?: number;
};

// Implementação em memória: começa pelos projetos atuais do site e volta ao estado
// inicial ao recarregar a página. Nada sai do navegador.
export function createLocalAdminProjects(options: Options = {}): AdminProjectsService {
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  let rows = renumber(sortByOrder(structuredClone(options.initial ?? mockProjects)));

  const wait = () =>
    delayMs > 0 ? new Promise<void>((resolve) => setTimeout(resolve, delayMs)) : Promise.resolve();

  function find(id: string): ProjectRow {
    const row = rows.find((item) => item.id === id);
    if (!row) throw new AdminServiceError("not_found");
    return row;
  }

  function assertSlugFree(slug: string, ignoreId?: string) {
    if (rows.some((item) => item.slug === slug && item.id !== ignoreId)) {
      throw new AdminServiceError("slug_taken");
    }
  }

  // Coloca o projeto na posição pedida e renumera todos de 0 em diante
  function placeAt(row: ProjectRow, position: number) {
    const others = rows.filter((item) => item.id !== row.id);
    const index = Math.min(Math.max(Math.trunc(position), 0), others.length);
    others.splice(index, 0, row);
    rows = renumber(others);
  }

  return {
    async list(filters = {}) {
      await wait();
      const query = normalizeSearch(filters.q ?? "");
      return rows
        .filter((row) => {
          if (filters.category && row.category !== filters.category) return false;
          if (filters.status && row.status !== filters.status) return false;
          if (!query) return true;
          return [row.title_pt, row.title_en].some((title) =>
            normalizeSearch(title).includes(query),
          );
        })
        .map((row) => structuredClone(row));
    },

    async get(id) {
      await wait();
      const row = rows.find((item) => item.id === id);
      return row ? structuredClone(row) : null;
    },

    async isSlugAvailable(slug, ignoreId) {
      await wait();
      return !rows.some((item) => item.slug === slug && item.id !== ignoreId);
    },

    async create(draft) {
      await wait();
      assertSlugFree(draft.slug);
      const now = new Date().toISOString();
      const row: ProjectRow = {
        ...fromDraft(draft),
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
      };
      placeAt(row, draft.sort_order);
      return structuredClone(find(row.id));
    },

    async update(id, draft) {
      await wait();
      const current = find(id);
      assertSlugFree(draft.slug, id);
      const row: ProjectRow = {
        ...current,
        ...fromDraft(draft),
        updated_at: nextTimestamp(current.updated_at),
      };
      placeAt(row, draft.sort_order);
      return structuredClone(find(id));
    },

    async remove(id) {
      await wait();
      find(id);
      rows = renumber(rows.filter((item) => item.id !== id));
    },

    async setPublished(id, value) {
      await wait();
      return structuredClone(patch(id, { published: value }));
    },

    async setFeatured(id, value) {
      await wait();
      return structuredClone(patch(id, { featured: value }));
    },

    async move(id, direction: MoveDirection) {
      await wait();
      const index = rows.findIndex((item) => item.id === id);
      if (index === -1) throw new AdminServiceError("not_found");
      const target = direction === "up" ? index - 1 : index + 1;
      if (target >= 0 && target < rows.length) {
        const next = [...rows];
        [next[index], next[target]] = [next[target], next[index]];
        rows = renumber(next);
      }
      return rows.map((row) => structuredClone(row));
    },
  };

  function patch(id: string, changes: Partial<ProjectRow>): ProjectRow {
    const current = find(id);
    const row = { ...current, ...changes, updated_at: nextTimestamp(current.updated_at) };
    rows = rows.map((item) => (item.id === id ? row : item));
    return row;
  }
}

// Instância usada pelas telas
export const localAdminProjects = createLocalAdminProjects();

function sortByOrder(rows: ProjectRow[]): ProjectRow[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order);
}

function renumber(rows: ProjectRow[]): ProjectRow[] {
  return rows.map((row, index) => (row.sort_order === index ? row : { ...row, sort_order: index }));
}

// Garante que `updated_at` sempre muda, mesmo em duas edições no mesmo milissegundo
function nextTimestamp(previous: string): string {
  const now = Date.now();
  const last = Date.parse(previous);
  return new Date(Number.isNaN(last) || now > last ? now : last + 1).toISOString();
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

// Rascunho do formulário → linha da tabela (textos vazios viram null)
function fromDraft(draft: ProjectDraft): Omit<ProjectRow, "id" | "created_at" | "updated_at"> {
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
