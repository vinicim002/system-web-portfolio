import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { ProjectsArchive } from "@/components/sections/projects/ProjectsArchive";
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
  const projects = await getProjects(locale);

  return (
    <main>
      <Container className="flex flex-col gap-10 pt-6 lg:pt-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs tracking-widest text-accent-text uppercase">{t("eyebrow")}</p>
            <h1 className="mt-2 text-6xl tracking-tighter lg:text-8xl">{t("title")}</h1>
          </div>
          <div className="max-w-md lg:text-right">
            <p className="text-muted-foreground">{t("subtitle")}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{t("count", { count: projects.length })}</p>
          </div>
        </header>

        <ProjectsArchive projects={projects} archiveLabel={t("eyebrow")} />
      </Container>
    </main>
  );
}
