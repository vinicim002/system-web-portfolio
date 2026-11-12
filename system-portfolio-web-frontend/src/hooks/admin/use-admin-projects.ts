"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { adminProjects } from "@/lib/api/admin/projects";
import type { MoveDirection, ProjectDraft, ProjectFilters } from "@/types/admin";

// Chaves do cache das telas; `all` invalida lista e itens de uma vez
export const projectKeys = {
  all: ["admin", "projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  item: (id: string) => [...projectKeys.all, "item", id] as const,
};

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
  return useMutation({
    mutationFn: ({ id, draft }: SaveInput) =>
      id ? adminProjects.update(id, draft) : adminProjects.create(draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminProjects.remove(id),
    // O item não é removido do cache aqui para a edição não piscar "não encontrado"
    // antes de voltar para a lista; ele é buscado de novo ao abrir o id outra vez
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.item(id), refetchType: "none" });
      return queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

type ToggleInput = { id: string; value: boolean };

export function useTogglePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: ToggleInput) => adminProjects.setPublished(id, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: ToggleInput) => adminProjects.setFeatured(id, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

type MoveInput = { id: string; direction: MoveDirection };

export function useMoveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, direction }: MoveInput) => adminProjects.move(id, direction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
  });
}

// Checagem de slug único para dar retorno antes de salvar (ignora o próprio projeto)
export function useSlugAvailability() {
  return useCallback((slug: string, ignoreId?: string) => adminProjects.isSlugAvailable(slug, ignoreId), []);
}
