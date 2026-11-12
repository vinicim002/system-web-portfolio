import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { ProjectsArchive } from "@/components/sections/projects/ProjectsArchive";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/api/projects";

export async function generateMetadata({ params }: PageProps<"/[locale]/projetos">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "projectsPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projetos">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("projectsPage");

  return (
    <main>
      <Container className="flex flex-col gap-10 pt-6 lg:gap-14 lg:pt-10">
        {/* Os projetos ficam numa fronteira de Suspense: depois que o admin salva, só esta parte é
            gerada de novo (no Cloudflare, regenerar a página inteira travava o Worker) */}
        <Suspense fallback={<ProjectsArchiveSkeleton title={t("title")} subtitle={t("subtitle")} />}>
          <ProjectsArchiveSection locale={locale} />
        </Suspense>

        <CtaBanner title={t("cta.title")} button={t("cta.button")} waves />
      </Container>
    </main>
  );
}

async function ProjectsArchiveSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("projectsPage");
  const projects = await getProjects(locale);

  return (
    <>
      {/* Cabeçalho editorial: título gigante com a contagem ao lado */}
      <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <h1 className="text-7xl leading-[0.85] tracking-tighter sm:text-8xl lg:text-9xl">
          {t("title")}
          <sup aria-hidden className="ml-2 align-top font-mono text-base font-medium tracking-normal text-accent-text lg:text-2xl">
            ({String(projects.length).padStart(2, "0")})
          </sup>
          <span className="sr-only"> — {t("count", { count: projects.length })}</span>
        </h1>
        <p className="max-w-sm text-muted-foreground lg:pb-3 lg:text-right lg:text-lg">{t("subtitle")}</p>
      </header>

      <ProjectsArchive projects={projects} archiveLabel={t("eyebrow")} />
    </>
  );
}

function ProjectsArchiveSkeleton({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <h1 className="text-7xl leading-[0.85] tracking-tighter sm:text-8xl lg:text-9xl">{title}</h1>
        <p className="max-w-sm text-muted-foreground lg:pb-3 lg:text-right lg:text-lg">{subtitle}</p>
      </header>
      <div className="h-[28rem] animate-pulse rounded-3xl bg-card motion-reduce:animate-none" />
    </>
  );
}
