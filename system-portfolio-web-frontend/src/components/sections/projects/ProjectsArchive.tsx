"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ProjectCategory, ProjectSummary } from "@/types/project";

const categories = ["all", "web", "mobile", "automation"] as const;
type CategoryFilter = (typeof categories)[number];

// Cores de fundo das tiras sem capa, alternando entre os tokens da marca
const fallbackTones = ["bg-primary", "bg-secondary", "bg-foreground text-background"];

type ProjectsArchiveProps = {
  projects: ProjectSummary[];
  archiveLabel: string;
};

// Arquivo de projetos em tiras verticais (estilo pastas). No desktop a tira
// ativa expande ao passar o mouse/focar; no mobile todas ficam abertas.
export function ProjectsArchive({ projects, archiveLabel }: ProjectsArchiveProps) {
  const t = useTranslations("project");
  const tPage = useTranslations("projectsPage");
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const result: Record<CategoryFilter, number> = { all: projects.length, web: 0, mobile: 0, automation: 0 };
    for (const project of projects) {
      if (project.category) result[project.category as ProjectCategory] += 1;
    }
    return result;
  }, [projects]);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const currentId = visible.some((p) => p.id === activeId) ? activeId : visible[0]?.id;

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label={tPage("filterLabel")} className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={filter === category}
            disabled={counts[category] === 0}
            onClick={() => setFilter(category)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              filter === category
                ? "border-transparent bg-primary text-primary-foreground dark:bg-secondary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`category.${category}`)}
            <span className="ml-1.5 font-mono text-xs opacity-70">{counts[category]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-muted-foreground">{tPage("empty")}</p>
      ) : (
        <div className="flex flex-col gap-3 md:h-[clamp(480px,68vh,720px)] md:flex-row md:gap-2">
          {/* Lombada do arquivo */}
          <div
            aria-hidden
            className="hidden w-20 shrink-0 flex-col justify-between rounded-2xl bg-primary p-4 text-white md:flex lg:w-24"
          >
            <span className="rotate-180 text-2xl font-bold tracking-tight [writing-mode:vertical-rl]">
              {archiveLabel}
            </span>
            <span className="font-mono text-[10px] leading-relaxed text-white/60 [writing-mode:vertical-rl]">
              {siteConfig.domain}
            </span>
          </div>

          {visible.map((project, index) => {
            const isActive = project.id === currentId;
            const number = String(index + 1).padStart(2, "0");

            return (
              <Link
                key={project.id}
                href={{ pathname: "/projetos/[slug]", params: { slug: project.slug } }}
                onMouseEnter={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
                className={cn(
                  "group relative isolate flex h-[380px] overflow-hidden rounded-2xl text-white md:h-auto md:min-w-20 md:basis-0 md:transition-[flex-grow] md:duration-500 md:ease-out motion-reduce:transition-none",
                  isActive ? "md:grow-[6]" : "md:grow",
                  !project.coverUrl && fallbackTones[index % fallbackTones.length],
                )}
              >
                {project.coverUrl ? (
                  <Image src={project.coverUrl} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="-z-10 object-cover" />
                ) : (
                  <>
                    <span aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-40" />
                    <span
                      aria-hidden
                      className="absolute -right-4 -bottom-10 -z-10 text-[16rem] leading-none font-bold tracking-tighter opacity-15"
                    >
                      {project.title.charAt(0)}
                    </span>
                  </>
                )}

                {/* Aba da pasta com o número */}
                <span className="absolute top-4 left-4 font-mono text-xs opacity-80">{number}</span>

                {/* Título vertical quando a tira está fechada (desktop) */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-6 left-1/2 hidden -translate-x-1/2 rotate-180 text-lg font-bold whitespace-nowrap transition-opacity duration-300 [writing-mode:vertical-rl]",
                    isActive ? "md:opacity-0" : "md:block",
                  )}
                >
                  {project.title}
                </span>

                {/* Conteúdo da tira aberta */}
                <span
                  className={cn(
                    "mt-auto flex w-full flex-col gap-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 pt-20 transition-opacity duration-300 md:min-w-[22rem] lg:p-8",
                    isActive ? "md:opacity-100 md:delay-200" : "md:pointer-events-none md:opacity-0",
                  )}
                >
                  <span className="w-fit rounded-full border border-white/30 px-2.5 py-0.5 text-[11px] font-medium">
                    {t(`status.${project.status}`)}
                  </span>
                  <span className="text-3xl font-bold tracking-tight lg:text-5xl">{project.title}</span>
                  {project.summary ? (
                    <span className="max-w-xl text-sm leading-relaxed text-white/80 lg:text-base">
                      {project.summary}
                    </span>
                  ) : null}
                  <span className="font-mono text-xs text-white/70">{project.techStack.join(" · ")}</span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium">
                    {t("openCase")}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
