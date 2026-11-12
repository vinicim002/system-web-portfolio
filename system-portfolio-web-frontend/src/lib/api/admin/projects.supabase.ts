import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminSupabase } from "@/lib/supabase/admin-client";
import type { ProjectRow } from "@/types/project";
import { AdminServiceError } from "./errors";
import { draftToColumns, isUuid, matchesQuery, placeAt, sameOrder, swapOrder, toAdminError } from "./project-rows";
import type { AdminProjectsService } from "./projects";

// Implementação real do AdminProjectsService (spec 002). O RLS só deixa o admin com segundo
// fator (aal2) ver rascunhos e gravar; as telas não mudam em relação à implementação local.

function client(): SupabaseClient {
  const supabase = getAdminSupabase();
  if (!supabase) throw new AdminServiceError("session_expired");
  return supabase;
}

async function orderedIds(supabase: SupabaseClient): Promise<string[]> {
  const { data, error } = await supabase.from("projects").select("id").order("sort_order").order("created_at");
  if (error) throw toAdminError(error);
  return (data ?? []).map((row) => row.id as string);
}

// Grava a ordem inteira numa transação (função reorder_projects)
async function saveOrder(supabase: SupabaseClient, ids: string[]) {
  const { error } = await supabase.rpc("reorder_projects", { ids });
  if (error) throw toAdminError(error);
}

async function fetchOne(supabase: SupabaseClient, id: string): Promise<ProjectRow | null> {
  if (!isUuid(id)) return null;
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw toAdminError(error);
  return (data as ProjectRow | null) ?? null;
}

async function mustFetch(supabase: SupabaseClient, id: string): Promise<ProjectRow> {
  const row = await fetchOne(supabase, id);
  if (!row) throw new AdminServiceError("not_found");
  return row;
}

// Coloca o projeto na posição pedida, só regravando a ordem se ela mudou
async function placeProject(supabase: SupabaseClient, id: string, position: number) {
  const current = await orderedIds(supabase);
  const next = placeAt(current, id, position);
  if (!sameOrder(current, next)) await saveOrder(supabase, next);
}

async function patch(id: string, changes: Partial<ProjectRow>): Promise<ProjectRow> {
  const supabase = client();
  if (!isUuid(id)) throw new AdminServiceError("not_found");
  const { data, error } = await supabase.from("projects").update(changes).eq("id", id).select("*").maybeSingle();
  if (error) throw toAdminError(error);
  if (!data) throw new AdminServiceError("not_found");
  return data as ProjectRow;
}

export const supabaseAdminProjects: AdminProjectsService = {
  async list(filters = {}) {
    let query = client().from("projects").select("*").order("sort_order").order("created_at");
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.status) query = query.eq("status", filters.status);
    const { data, error } = await query;
    if (error) throw toAdminError(error);
    // Busca sem acento no próprio navegador (poucos projetos)
    return ((data ?? []) as ProjectRow[]).filter((row) => matchesQuery(row, filters.q));
  },

  async get(id) {
    return fetchOne(client(), id);
  },

  async isSlugAvailable(slug, ignoreId) {
    let query = client().from("projects").select("id").eq("slug", slug.trim());
    if (ignoreId && isUuid(ignoreId)) query = query.neq("id", ignoreId);
    const { data, error } = await query.limit(1);
    if (error) throw toAdminError(error);
    return (data ?? []).length === 0;
  },

  async create(draft) {
    const supabase = client();
    const id = crypto.randomUUID();
    const { sort_order: position, ...columns } = draftToColumns(draft);
    const total = (await orderedIds(supabase)).length;

    // Entra no fim e depois vai para a posição pedida (a ordem nunca fica com número repetido)
    const { error } = await supabase.from("projects").insert({ ...columns, id, sort_order: total });
    if (error) throw toAdminError(error);
    await placeProject(supabase, id, position);
    return mustFetch(supabase, id);
  },

  async update(id, draft) {
    const supabase = client();
    const current = await mustFetch(supabase, id);
    const { sort_order: position, ...columns } = draftToColumns(draft);

    const { data, error } = await supabase.from("projects").update(columns).eq("id", id).select("id").maybeSingle();
    if (error) throw toAdminError(error);
    if (!data) throw new AdminServiceError("not_found");
    if (position !== current.sort_order) await placeProject(supabase, id, position);
    return mustFetch(supabase, id);
  },

  async remove(id) {
    const supabase = client();
    if (!isUuid(id)) throw new AdminServiceError("not_found");
    const { data, error } = await supabase.from("projects").delete().eq("id", id).select("id");
    if (error) throw toAdminError(error);
    if (!data || data.length === 0) throw new AdminServiceError("not_found");
    // Renumera os que sobraram de 0 em diante
    const remaining = await orderedIds(supabase);
    if (remaining.length > 0) await saveOrder(supabase, remaining);
  },

  async setPublished(id, value) {
    return patch(id, { published: value });
  },

  async setFeatured(id, value) {
    return patch(id, { featured: value });
  },

  async move(id, direction) {
    const supabase = client();
    const current = await orderedIds(supabase);
    const next = swapOrder(current, id, direction);
    if (!sameOrder(current, next)) await saveOrder(supabase, next);
    return supabaseAdminProjects.list();
  },
};
