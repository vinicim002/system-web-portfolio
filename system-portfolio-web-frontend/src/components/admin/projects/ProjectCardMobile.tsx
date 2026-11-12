"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEditHref } from "@/hooks/admin/use-project-filters";
import type { ProjectRow } from "@/types/project";
import { FeaturedMark, PublicationBadge, StatusBadge, useCategoryLabel } from "./ProjectBadges";

// Mesmas informações da tabela, em cartão, para o celular (RF-023)
type ProjectCardMobileProps = {
  project: ProjectRow;
  actions: React.ReactNode;
};

export function ProjectCardMobile({ project, actions }: ProjectCardMobileProps) {
  const t = useTranslations("admin.projects.list");
  const categoryLabel = useCategoryLabel();
  const editHref = useEditHref();

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm text-muted-foreground"
          title={t("columns.order")}
        >
          {project.sort_order}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={editHref(project.id)}
            title={t("edit", { title: project.title_pt })}
            className="font-medium outline-none hover:text-accent-text focus-visible:underline"
          >
            {project.title_pt}
          </Link>
          <p className="truncate text-sm text-muted-foreground">{categoryLabel(project.category)}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={project.status} />
        <PublicationBadge published={project.published} />
        <FeaturedMark featured={project.featured} />
      </div>
      <div className="border-t border-border pt-2">{actions}</div>
    </article>
  );
}
