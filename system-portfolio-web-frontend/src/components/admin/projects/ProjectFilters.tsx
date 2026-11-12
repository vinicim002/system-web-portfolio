"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectFilters } from "@/hooks/admin/use-project-filters";
import type { ProjectCategory, ProjectStatus } from "@/types/project";

// Valor usado no Select para "sem filtro" (o Radix não aceita valor vazio)
const ALL = "all";

// Busca por título e filtros combináveis por categoria e status (RF-010)
export function ProjectFilters() {
  const t = useTranslations("admin.projects");
  const { filters, setFilters, hasFilters, categories, statuses } = useProjectFilters();
  const [query, setQuery] = useState(filters.q ?? "");

  // Mantém o campo igual à URL quando ela muda por fora (ex.: "limpar filtros")
  const [lastUrlQuery, setLastUrlQuery] = useState(filters.q);
  if (filters.q !== lastUrlQuery) {
    setLastUrlQuery(filters.q);
    if ((filters.q ?? "") !== query.trim()) setQuery(filters.q ?? "");
  }

  // Grava a busca na URL depois de uma pausa na digitação
  useEffect(() => {
    if (query.trim() === (filters.q ?? "")) return;
    const timer = setTimeout(() => setFilters({ ...filters, q: query }), 250);
    return () => clearTimeout(timer);
  }, [query, filters, setFilters]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          aria-label={t("list.search")}
          placeholder={t("list.searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-10 pl-9"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex">
        <Select
          value={filters.category ?? ALL}
          onValueChange={(value) =>
            setFilters({ ...filters, q: query, category: value === ALL ? undefined : (value as ProjectCategory) })
          }
        >
          <SelectTrigger aria-label={t("list.category")} className="h-10 w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("list.allCategories")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {t(`labels.category.${category}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? ALL}
          onValueChange={(value) =>
            setFilters({ ...filters, q: query, status: value === ALL ? undefined : (value as ProjectStatus) })
          }
        >
          <SelectTrigger aria-label={t("list.status")} className="h-10 w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("list.allStatuses")}</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {t(`labels.status.${status}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button type="button" variant="ghost" size="lg" className="self-start px-3 md:self-auto" onClick={() => setFilters({})}>
          <X aria-hidden />
          {t("list.clear")}
        </Button>
      )}
    </div>
  );
}
