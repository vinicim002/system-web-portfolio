import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ProjectLinks } from "@/components/sections/shared/ProjectLinks";
import { Link } from "@/i18n/navigation";
import { getLatestProjects } from "@/lib/api/projects";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/types/project";
import { BentoCard } from "./BentoCard";

type LatestProjectsCardProps = {
  locale: Locale;
  className?: string;
};

// Capa do projeto; sem imagem, mostra a inicial sobre a cor da marca
function ProjectThumb({ project }: { project: ProjectSummary }) {
  return (
    <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-2xl font-bold text-white">
      {project.coverUrl ? (
        <Image src={project.coverUrl} alt="" fill sizes="80px" className="object-cover" />
      ) : (
        <span aria-hidden>{project.title.charAt(0)}</span>
      )}
    </span>
  );
}

export async function LatestProjectsCard({ locale, className }: LatestProjectsCardProps) {
  const t = await getTranslations("home.projects");
  const tProject = await getTranslations("project");
  // Três itens cabem no card; o resto fica em "Ver todos"
  const projects = await getLatestProjects(locale, 3);

  return (
    <BentoCard waves className={cn("flex flex-col", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm">{t("title")}</h2>
        <Link
          href="/projetos"
          className="text-xs font-medium text-accent-text underline-offset-4 hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        // Rola dentro do card se a tela for baixa, em vez de cortar o conteúdo
        <ul className="-mx-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-6 [mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((project) => (
            <li
              key={project.id}
              className="group relative -mx-2 flex items-start gap-4 rounded-2xl p-2 transition-colors has-[a:hover]:bg-muted/70"
            >
              <ProjectThumb project={project} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {/* Link do case com área de clique cobrindo o item inteiro */}
                  <Link
                    href={{ pathname: "/projetos/[slug]", params: { slug: project.slug } }}
                    className="font-medium after:absolute after:inset-0 after:rounded-2xl"
                  >
                    {project.title}
                  </Link>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {tProject(`status.${project.status}`)}
                  </span>
                </div>
                {project.summary ? (
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                ) : null}
                {project.techStack.length > 0 ? (
                  <p className="truncate font-mono text-[10px] text-accent-text">
                    {project.techStack.slice(0, 4).join(" · ")}
                  </p>
                ) : null}

                {/* Acima do link estendido para continuarem clicáveis */}
                <ProjectLinks
                  className="relative z-10 mt-2"
                  demoUrl={project.demoUrl}
                  repoUrl={project.repoUrl}
                  labels={{ deploy: tProject("deploy"), github: tProject("github"), soon: tProject("soon") }}
                />
              </div>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </li>
          ))}
        </ul>
      )}
    </BentoCard>
  );
}
