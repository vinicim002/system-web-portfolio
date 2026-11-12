"use client";

import { ArrowLeft, Construction, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { NotFoundState } from "@/components/admin/shared/NotFoundState";
import { Button } from "@/components/ui/button";
import { useAdminSystem } from "@/hooks/admin/use-admin-systems";
import { SystemIcon } from "./SystemIcon";

// Esqueleto do painel de um sistema (RF-008); o painel completo é a especificação 002
export function SystemPlaceholder() {
  const t = useTranslations("admin");
  const { slug } = useParams<{ slug: string }>();
  const { data: system, isPending } = useAdminSystem(slug);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">{t("common.loading")}</p>;
  }

  // Sistema inexistente ou ainda "em breve" não tem painel (RF-024)
  if (!system || system.state !== "live") {
    return (
      <NotFoundState
        title={t("systems.notFound")}
        description={t("systems.notFoundHint")}
        href="/admin/sistemas"
        linkLabel={t("systems.backToSystems")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Button asChild variant="ghost" className="self-start">
        <Link href="/admin/sistemas">
          <ArrowLeft aria-hidden />
          {t("systems.backToSystems")}
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-4">
        <SystemIcon name={system.name} className="size-14 text-xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{system.name}</h1>
          <p className="text-muted-foreground">{t("systems.state.live")}</p>
        </div>
        {system.url && (
          <Button asChild variant="outline" size="lg" className="px-3">
            <a href={system.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden />
              {t("systems.visitSite")}
              <span className="sr-only">{t("nav.newTab")}</span>
            </a>
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-accent-text">
          <Construction className="size-5" aria-hidden />
        </span>
        <h2 className="text-lg font-bold">{t("systems.underConstruction")}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{t("systems.underConstructionHint")}</p>
      </div>
    </div>
  );
}
