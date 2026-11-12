"use client";

import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { GuardedLink } from "@/components/admin/shared/LeaveGuard";
import { NotFoundState } from "@/components/admin/shared/NotFoundState";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAdminProject } from "@/hooks/admin/use-admin-projects";
import { useBackToListHref } from "@/hooks/admin/use-project-filters";
import { toDraft } from "@/lib/project-draft";
import { ProjectForm } from "./ProjectForm";

type ProjectEditorProps = {
  // Ações extras no rodapé (ex.: excluir), recebem o id e o título
  renderFooterExtra?: (project: { id: string; title: string; backHref: string }) => React.ReactNode;
};

// Edição: carrega o projeto pelo id da URL; id inexistente mostra "não encontrado" (RF-024)
export function ProjectEditor({ renderFooterExtra }: ProjectEditorProps) {
  const t = useTranslations("admin");
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
        footerExtra={renderFooterExtra?.({ id: project.id, title: project.title_pt, backHref })}
      />
    </>
  );
}
