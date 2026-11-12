"use client";

import { FolderPlus, SearchX } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { useAdminProjects } from "@/hooks/admin/use-admin-projects";
import { useProjectFilters } from "@/hooks/admin/use-project-filters";
import { ProjectCardMobile } from "./ProjectCardMobile";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectsTable } from "./ProjectsTable";

// Tela Projetos: filtros na URL, tabela no computador e cartões no celular
export function ProjectsList() {
  const t = useTranslations("admin");
  const { filters, setFilters, hasFilters } = useProjectFilters();
  const { data: projects, isPending, isError } = useAdminProjects(filters);

  return (
    <div className="flex flex-col gap-5">
      <ProjectFilters />

      {isPending ? (
        <div className="flex flex-col gap-2" aria-busy="true" aria-label={t("common.loading")}>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">{t("projects.list.loadError")}</p>
      ) : projects.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title={t("projects.list.noResults")}
            description={t("projects.list.noResultsHint")}
            action={
              <Button type="button" variant="outline" size="lg" className="px-4" onClick={() => setFilters({})}>
                {t("projects.list.clear")}
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={FolderPlus}
            title={t("projects.list.empty")}
            description={t("projects.list.emptyHint")}
            action={
              <Button asChild size="lg" className="px-4">
                <Link href="/admin/projetos/novo">{t("projects.new")}</Link>
              </Button>
            }
          />
        )
      ) : (
        <>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {t("projects.list.count", { count: projects.length })}
          </p>
          <div className="hidden md:block">
            <ProjectsTable projects={projects} />
          </div>
          <ul className="flex flex-col gap-3 md:hidden">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCardMobile project={project} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
