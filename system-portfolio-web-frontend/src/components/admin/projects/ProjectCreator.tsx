"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { GuardedLink } from "@/components/admin/shared/LeaveGuard";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAdminProjects } from "@/hooks/admin/use-admin-projects";
import { emptyDraft } from "@/lib/project-draft";
import { ProjectForm } from "./ProjectForm";

// Novo projeto: formulário em branco, rascunho, em evolução e no fim da lista
export function ProjectCreator() {
  const t = useTranslations("admin");
  const { data: projects, isPending } = useAdminProjects();

  return (
    <>
      <Button asChild variant="ghost" className="mb-4 -ml-2.5">
        <GuardedLink href="/admin/projetos">
          <ArrowLeft aria-hidden />
          {t("projects.form.backToList")}
        </GuardedLink>
      </Button>
      <PageHeader title={t("projects.form.newTitle")} description={t("projects.form.newSubtitle")} />
      {isPending ? (
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : (
        <ProjectForm initial={emptyDraft(projects?.length ?? 0)} backHref="/admin/projetos" />
      )}
    </>
  );
}
