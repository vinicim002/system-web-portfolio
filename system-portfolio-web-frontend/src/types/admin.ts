import type { ProjectCategory, ProjectRow, ProjectStatus } from "@/types/project";

// Campos editáveis de um projeto no formulário do admin.
// Listas sempre como array e textos vazios como "" (viram null ao salvar).
export type ProjectDraft = {
  slug: string;
  title_pt: string;
  title_en: string;
  summary_pt: string;
  summary_en: string;
  content_pt: string;
  content_en: string;
  category: ProjectCategory | "";
  status: ProjectStatus;
  tech_stack: string[];
  cover_url: string;
  gallery_urls: string[];
  repo_url: string;
  demo_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

// Filtros da lista de projetos (também guardados na URL)
export type ProjectFilters = {
  q?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
};

export type MoveDirection = "up" | "down";

// Imagem escolhida no formulário, mantida só no navegador (envio simulado)
export type PreviewImage = {
  url: string;
  name: string;
  // até 5 MB (5.242.880 bytes)
  size: number;
  kind: "cover" | "gallery";
};

export const MAX_IMAGE_BYTES = 5_242_880;

export type SystemHealth = "up" | "degraded" | "down";

// Resumo de exemplo exibido no card enquanto as fontes reais não existem (spec 002)
export type SystemSample = {
  status: SystemHealth;
  uptimePercent: number;
  visitsLast7Days: number;
  blockedThreatsLast7Days: number;
  checkedAt: string;
};

// Sistema do autor exibido na central de sistemas
export type MonitoredSystem = {
  slug: string;
  name: string;
  url: string | null;
  state: "live" | "soon";
  sample: SystemSample | null;
};

export type { ProjectRow };
