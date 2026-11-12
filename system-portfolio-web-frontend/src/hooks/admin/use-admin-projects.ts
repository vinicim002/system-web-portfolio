"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { adminProjects } from "@/lib/api/admin/projects";
import { revalidatePublicSite } from "@/lib/api/admin/revalidate";
import type { MoveDirection, ProjectDraft, ProjectFilters } from "@/types/admin";

// Chaves do cache das telas; `all` invalida lista e itens de uma vez
export const projectKeys = {
  all: ["admin", "projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  item: (id: string) => [...projectKeys.all, "item", id] as const,
};

// Depois de gravar, pede ao site que mostre a mudança; se não der, só avisa (a gravação continua valendo)
function useRefreshPublicSite() {
  const t = useTranslations("admin.projects.actions");
  return useCallback(() => {
    void revalidatePublicSite().then((ok) => {
      if (!ok) toast.warning(t("revalidateFailed"));
    });
  }, [t]);
}

export function useAdminProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => adminProjects.list(filters),
  });
}

export function useAdminProject(id: string) {
  return useQuery({
    queryKey: projectKeys.item(id),
    queryFn: () => adminProjects.get(id),
  });
}

type SaveInput = { id?: string; draft: ProjectDraft };

// Cria quando não há `id`; edita quando há
export function useSaveProject() {
  const queryClient = useQueryClient();
  const refreshSite = useRefreshPublicSite();
  return useMutation({
    mutationFn: ({ id, draft }: SaveInput) =>
      id ? adminProjects.update(id, draft) : adminProjects.create(draft),
    onSuccess: () => {
      refreshSite();
      return queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const refreshSite = useRefreshPublicSite();
  return useMutation({
    mutationFn: (id: string) => adminProjects.remove(id),
    // O item não é removido do cache aqui para a edição não piscar "não encontrado"
    // antes de voltar para a lista; ele é buscado de novo ao abrir o id outra vez
    onSuccess: (_, id) => {
      refreshSite();
      queryClient.invalidateQueries({ queryKey: projectKeys.item(id), refetchType: "none" });
      return queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

type ToggleInput = { id: string; value: boolean };

export function useTogglePublished() {
  const queryClient = useQueryClient();
  const refreshSite = useRefreshPublicSite();
  return useMutation({
    mutationFn: ({ id, value }: ToggleInput) => adminProjects.setPublished(id, value),
    onSuccess: () => {
      refreshSite();
      return queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();
  const refreshSite = useRefreshPublicSite();
  return useMutation({
    mutationFn: ({ id, value }: ToggleInput) => adminProjects.setFeatured(id, value),
    onSuccess: () => {
      refreshSite();
      return queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

type MoveInput = { id: string; direction: MoveDirection };

export function useMoveProject() {
  const queryClient = useQueryClient();
  const refreshSite = useRefreshPublicSite();
  return useMutation({
    mutationFn: ({ id, direction }: MoveInput) => adminProjects.move(id, direction),
    onSuccess: () => {
      refreshSite();
      return queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// Checagem de slug único para dar retorno antes de salvar (ignora o próprio projeto)
export function useSlugAvailability() {
  return useCallback((slug: string, ignoreId?: string) => adminProjects.isSlugAvailable(slug, ignoreId), []);
}
