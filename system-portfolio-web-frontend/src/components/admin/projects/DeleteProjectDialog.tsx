"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteProject } from "@/hooks/admin/use-admin-projects";

type DeleteProjectDialogProps = {
  project: { id: string; title: string } | null;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};

// Confirmação de exclusão mostrando o título (RF-019); cancelar não muda nada
export function DeleteProjectDialog({ project, onOpenChange, onDeleted }: DeleteProjectDialogProps) {
  const t = useTranslations("admin.projects.actions");
  const remove = useDeleteProject();

  async function confirm(event: React.MouseEvent) {
    // Mantém o diálogo aberto até a exclusão terminar
    event.preventDefault();
    if (!project) return;
    try {
      await remove.mutateAsync(project.id);
      toast.success(t("deleted", { title: project.title }));
      onOpenChange(false);
      onDeleted?.();
    } catch {
      toast.error(t("error"));
    }
  }

  return (
    <AlertDialog open={project !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{project && t("deleteTitle", { title: project.title })}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={remove.isPending}>{t("deleteCancel")}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={remove.isPending} onClick={confirm}>
            {t("deleteConfirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
