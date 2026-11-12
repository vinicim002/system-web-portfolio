"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProjectRow } from "@/types/project";
import { FeaturedMark, PublicationBadge, StatusBadge, useCategoryLabel } from "./ProjectBadges";

// Lista de projetos no computador (RF-009)
export function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const t = useTranslations("admin.projects.list");
  const categoryLabel = useCategoryLabel();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableCaption className="sr-only">{t("tableCaption")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 pl-4">{t("columns.order")}</TableHead>
            <TableHead>{t("columns.title")}</TableHead>
            <TableHead>{t("columns.category")}</TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            <TableHead>{t("columns.publication")}</TableHead>
            <TableHead>{t("columns.featured")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="pl-4 font-mono text-muted-foreground tabular-nums">{project.sort_order}</TableCell>
              <TableCell>
                <Link
                  href={`/admin/projetos/${project.id}`}
                  title={t("edit", { title: project.title_pt })}
                  className="font-medium outline-none hover:text-accent-text focus-visible:underline"
                >
                  {project.title_pt}
                </Link>
                <p className="font-mono text-xs text-muted-foreground">/{project.slug}</p>
              </TableCell>
              <TableCell className="text-muted-foreground">{categoryLabel(project.category)}</TableCell>
              <TableCell>
                <StatusBadge status={project.status} />
              </TableCell>
              <TableCell>
                <PublicationBadge published={project.published} />
              </TableCell>
              <TableCell>
                <FeaturedMark featured={project.featured} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
