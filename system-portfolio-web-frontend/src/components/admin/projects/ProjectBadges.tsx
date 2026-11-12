"use client";

import { Eye, EyeOff, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { ProjectRow } from "@/types/project";

// Selos de status, publicação e destaque, iguais na tabela e nos cartões do celular
export function StatusBadge({ status }: { status: ProjectRow["status"] }) {
  const t = useTranslations("admin.projects.labels.status");
  return <Badge variant={status === "proposal" ? "outline" : "ghost"} className="bg-muted">{t(status)}</Badge>;
}

export function PublicationBadge({ published }: { published: boolean }) {
  const t = useTranslations("admin.projects.labels");
  return published ? (
    <Badge variant="secondary">
      <Eye aria-hidden />
      {t("published")}
    </Badge>
  ) : (
    <Badge variant="outline">
      <EyeOff aria-hidden />
      {t("draft")}
    </Badge>
  );
}

export function FeaturedMark({ featured }: { featured: boolean }) {
  const t = useTranslations("admin.projects.labels");
  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      <Star
        className={featured ? "size-4 fill-accent-text text-accent-text" : "size-4"}
        aria-hidden
      />
      {featured ? t("featured") : t("notFeatured")}
    </span>
  );
}

export function useCategoryLabel() {
  const t = useTranslations("admin.projects.labels.category");
  return (category: ProjectRow["category"]) => t(category ?? "none");
}
