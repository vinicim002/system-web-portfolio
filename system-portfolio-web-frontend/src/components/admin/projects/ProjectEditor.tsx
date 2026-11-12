"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { GuardedLink } from "@/components/admin/shared/LeaveGuard";
import { NotFoundState } from "@/components/admin/shared/NotFoundState";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAdminProject } from "@/hooks/admin/use-admin-projects";
import { useBackToListHref } from "@/hooks/admin/use-project-filters";
import { toDraft } from "@/lib/project-draft";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { ProjectForm } from "./ProjectForm";

// Edição: carrega o projeto pelo id da URL; id inexistente mostra "não encontrado" (RF-024)
export function ProjectEditor() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { id } = useParams<{ id: string }>();
  const backHref = useBackToListHref();
  const { data: project, isPending } = useAdminProject(id);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">{t("common.loading")}</p>;
  }

  if (!project) {
    return (
      <NotFoundState
        title={t("projects.form.notFound")}
        description={t("projects.form.notFoundHint")}
        href={backHref}
        linkLabel={t("projects.form.backToList")}
      />
    );
  }

  return (
    <>
      <Button asChild variant="ghost" className="mb-4 -ml-2.5">
        <GuardedLink href={backHref}>
          <ArrowLeft aria-hidden />
          {t("projects.form.backToList")}
        </GuardedLink>
      </Button>
      <PageHeader title={project.title_pt} description={t("projects.form.editTitle")} />
      {/* key: recomeça o formulário se o projeto mudar por fora */}
      <ProjectForm
        key={`${project.id}-${project.updated_at}`}
        projectId={project.id}
        initial={toDraft(project)}
        backHref={backHref}
        footerExtra={
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="px-3 text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 aria-hidden />
            {t("projects.actions.deleteProject")}
          </Button>
        }
      />
      <DeleteProjectDialog
        project={confirmDelete ? { id: project.id, title: project.title_pt } : null}
        onOpenChange={setConfirmDelete}
        onDeleted={() => router.push(backHref)}
      />
    </>
  );
}
