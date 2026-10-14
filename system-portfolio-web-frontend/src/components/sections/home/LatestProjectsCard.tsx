import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
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
  const projects = await getLatestProjects(locale);

  return (
    <BentoCard className={cn("flex flex-col", className)}>
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
        <ul className="flex flex-col gap-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={{ pathname: "/projetos/[slug]", params: { slug: project.slug } }}
                className="group -mx-2 flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-muted"
              >
                <ProjectThumb project={project} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium">{project.title}</span>
                    <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {tProject(`status.${project.status}`)}
                    </span>
                  </span>
                  {project.summary ? (
                    <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {project.summary}
                    </span>
                  ) : null}
                  <span className="truncate font-mono text-[10px] text-accent-text">
                    {project.techStack.slice(0, 4).join(" · ")}
                  </span>
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 self-start text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </BentoCard>
  );
}
