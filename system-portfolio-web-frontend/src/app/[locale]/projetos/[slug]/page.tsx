import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { Suspense } from "react";
import { ProjectCase } from "@/components/sections/project/ProjectCase";
import { ProjectCaseSkeleton } from "@/components/sections/project/ProjectCaseSkeleton";
import { routing } from "@/i18n/routing";
import { getProjectBySlug, getProjectSlugs } from "@/lib/api/projects";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projetos/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const project = await getProjectBySlug(locale, slug);
  if (!project) return {};
  return { title: project.title, description: project.summary ?? undefined };
}

export default function ProjectPage({ params }: PageProps<"/[locale]/projetos/[slug]">) {
  return (
    <main>
      <Suspense fallback={<ProjectCaseSkeleton />}>
        <ProjectCase params={params} />
      </Suspense>
    </main>
  );
}
