export type ProjectCategory = "mobile" | "web" | "automation";

// Status real do projeto (o dossiê exige deixar claro o que é proposta x entregue)
export type ProjectStatus = "production" | "mvp" | "in_progress" | "proposal";

// Espelha a tabela `projects` do Supabase (spec, seção 6)
export type ProjectRow = {
  id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  summary_pt: string | null;
  summary_en: string | null;
  content_pt: string | null;
  content_en: string | null;
  category: ProjectCategory | null;
  status: ProjectStatus;
  tech_stack: string[];
  cover_url: string | null;
  gallery_urls: string[];
  repo_url: string | null;
  demo_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Versão já traduzida, usada pelos componentes
export type ProjectSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: ProjectCategory | null;
  status: ProjectStatus;
  techStack: string[];
  coverUrl: string | null;
};


// Versão completa para a página do case
export type ProjectDetail = ProjectSummary & {
  content: string | null;
  galleryUrls: string[];
  repoUrl: string | null;
  demoUrl: string | null;
};
