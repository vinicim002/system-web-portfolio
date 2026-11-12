import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { connection } from "next/server";
import { Suspense } from "react";
import { ProjectCase } from "@/components/sections/project/ProjectCase";
import { ProjectCaseSkeleton } from "@/components/sections/project/ProjectCaseSkeleton";
import { routing } from "@/i18n/routing";
import { getProjectBySlug } from "@/lib/api/projects";

// Montada a cada visita (sem pré-render por slug): no Cloudflare, uma página estática que
// depende do cache "projects" travava o Worker ao ser refeita depois de o admin salvar.
// Os dados continuam no cache "projects".
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projetos/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const project = await getProjectBySlug(locale, slug);
  if (!project) return {};
  return { title: project.title, description: project.summary ?? undefined };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projetos/[slug]">) {
  await connection();
  return (
    <main>
      <Suspense fallback={<ProjectCaseSkeleton />}>
        <ProjectCase params={params} />
      </Suspense>
    </main>
  );
}
