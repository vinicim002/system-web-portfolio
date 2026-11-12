import type { MoveDirection, ProjectDraft, ProjectFilters } from "@/types/admin";
import type { ProjectRow } from "@/types/project";
import { localAdminProjects } from "./projects.local";
import { supabaseAdminProjects } from "./projects.supabase";

// Contrato dos projetos no admin (specs/001-admin-telas/contracts/servicos.md).
// As telas só conhecem esta interface; trocar a implementação não muda as telas.
export interface AdminProjectsService {
  list(filters?: ProjectFilters): Promise<ProjectRow[]>;
  get(id: string): Promise<ProjectRow | null>;
  isSlugAvailable(slug: string, ignoreId?: string): Promise<boolean>;
  create(draft: ProjectDraft): Promise<ProjectRow>;
  update(id: string, draft: ProjectDraft): Promise<ProjectRow>;
  remove(id: string): Promise<void>;
  setPublished(id: string, value: boolean): Promise<ProjectRow>;
  setFeatured(id: string, value: boolean): Promise<ProjectRow>;
  move(id: string, direction: MoveDirection): Promise<ProjectRow[]>;
}

// Com o Supabase configurado, grava de verdade (spec 002); sem ele, usa a implementação local
// em memória (desenvolvimento sem banco e testes)
const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const adminProjects: AdminProjectsService = hasSupabase ? supabaseAdminProjects : localAdminProjects;
