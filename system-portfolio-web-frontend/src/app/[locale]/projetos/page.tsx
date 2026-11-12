import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
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

// Rota montada a cada visita, sem casca pré-renderizada em cache. No Cloudflare, completar a
// fronteira de Suspense a partir da casca guardada depois de uma invalidação deixava a lista
// presa no esqueleto (o documento nunca terminava). Os dados continuam no cache "projects".
export const instant = false;

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projetos">) {
  await connection();
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("projectsPage");

  return (
    <main>
      <Container className="flex flex-col gap-10 pt-6 lg:gap-14 lg:pt-10">
        {/* Os projetos ficam numa fronteira de Suspense, gerada a cada visita: depois que o admin
            salva, só esta parte é refeita (no Cloudflare, re-pré-renderizar a página inteira travava) */}
        <Suspense fallback={<ProjectsArchiveSkeleton title={t("title")} subtitle={t("subtitle")} />}>
          <ProjectsArchiveSection locale={locale} />
        </Suspense>

        <CtaBanner title={t("cta.title")} button={t("cta.button")} waves />
      </Container>
    </main>
  );
}

async function ProjectsArchiveSection({ locale }: { locale: Locale }) {
  // Gerada a cada visita (os dados vêm do cache "projects"): no Cloudflare, re-pré-renderizar a
  // página inteira depois de uma invalidação travava o Worker; completar só esta parte funciona
  await connection();
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
