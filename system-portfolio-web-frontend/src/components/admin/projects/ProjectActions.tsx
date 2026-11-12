"use client";

import { ArrowDown, ArrowUp, EllipsisVertical, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useMoveProject, useToggleFeatured, useTogglePublished } from "@/hooks/admin/use-admin-projects";
import { useEditHref } from "@/hooks/admin/use-project-filters";
import { cn } from "@/lib/utils";
import type { ProjectRow } from "@/types/project";

type ProjectActionsProps = {
  project: ProjectRow;
  // Posição na lista completa (a ordem vale para todos os projetos, não só os filtrados)
  isFirst: boolean;
  isLast: boolean;
  onDelete: (project: { id: string; title: string }) => void;
};

// Ações rápidas da lista: publicar, destacar, subir/descer e menu com editar/excluir (RF-018, RF-020)
export function ProjectActions({ project, isFirst, isLast, onDelete }: ProjectActionsProps) {
  const t = useTranslations("admin.projects.actions");
  const editHref = useEditHref();
  const publish = useTogglePublished();
  const feature = useToggleFeatured();
  const move = useMoveProject();
  const title = project.title_pt;
  const busy = publish.isPending || feature.isPending || move.isPending;

  function togglePublished(value: boolean) {
    publish.mutate(
      { id: project.id, value },
      {
        onSuccess: () => toast.success(t(value ? "published" : "unpublished", { title })),
        onError: () => toast.error(t("error")),
      },
    );
  }

  function toggleFeatured() {
    const value = !project.featured;
    feature.mutate(
      { id: project.id, value },
      {
        onSuccess: () => toast.success(t(value ? "featured" : "unfeatured", { title })),
        onError: () => toast.error(t("error")),
      },
    );
  }

  function moveTo(direction: "up" | "down") {
    move.mutate(
      { id: project.id, direction },
      { onSuccess: () => toast.success(t("moved")), onError: () => toast.error(t("error")) },
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Switch
        checked={project.published}
        disabled={busy}
        aria-label={t("publish", { title })}
        onCheckedChange={togglePublished}
        className="mr-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={busy}
        aria-pressed={project.featured}
        aria-label={t(project.featured ? "unfeature" : "feature", { title })}
        title={t(project.featured ? "unfeature" : "feature", { title })}
        onClick={toggleFeatured}
      >
        <Star className={cn(project.featured && "fill-accent-text text-accent-text")} aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={busy || isFirst}
        aria-label={t("moveUp", { title })}
        title={t("moveUp", { title })}
        onClick={() => moveTo("up")}
      >
        <ArrowUp aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={busy || isLast}
        aria-label={t("moveDown", { title })}
        title={t("moveDown", { title })}
        onClick={() => moveTo("down")}
      >
        <ArrowDown aria-hidden />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={t("more", { title })}>
            <EllipsisVertical aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={editHref(project.id)}>
              <Pencil aria-hidden />
              {t("edit")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete({ id: project.id, title })}>
            <Trash2 aria-hidden />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
