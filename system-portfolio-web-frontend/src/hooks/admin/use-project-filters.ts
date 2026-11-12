"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ProjectFilters } from "@/types/admin";
import type { ProjectCategory, ProjectStatus } from "@/types/project";

const categories: ProjectCategory[] = ["mobile", "web", "automation"];
const statuses: ProjectStatus[] = ["production", "mvp", "in_progress", "proposal"];

// Filtros da lista guardados na URL (?q=&categoria=&status=), para voltar da edição sem perder a busca
export function useProjectFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<ProjectFilters>(() => {
    const q = searchParams.get("q")?.trim() || undefined;
    const category = searchParams.get("categoria") as ProjectCategory | null;
    const status = searchParams.get("status") as ProjectStatus | null;
    return {
      q,
      category: category && categories.includes(category) ? category : undefined,
      status: status && statuses.includes(status) ? status : undefined,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (next: ProjectFilters) => {
      const params = new URLSearchParams();
      if (next.q?.trim()) params.set("q", next.q.trim());
      if (next.category) params.set("categoria", next.category);
      if (next.status) params.set("status", next.status);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const hasFilters = Boolean(filters.q || filters.category || filters.status);

  return { filters, setFilters, hasFilters, categories, statuses };
}

// Link de edição que leva os filtros atuais, para o "voltar" manter a busca (?lista=...)
export function useEditHref() {
  const searchParams = useSearchParams();
  const list = searchParams.toString();
  return useCallback(
    (id: string) => `/admin/projetos/${id}${list ? `?lista=${encodeURIComponent(list)}` : ""}`,
    [list],
  );
}

// Volta para a lista com os filtros que estavam ativos ao abrir a edição
export function useBackToListHref() {
  const list = useSearchParams().get("lista");
  return list ? `/admin/projetos?${list}` : "/admin/projetos";
}
