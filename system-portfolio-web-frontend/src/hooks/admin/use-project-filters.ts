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
