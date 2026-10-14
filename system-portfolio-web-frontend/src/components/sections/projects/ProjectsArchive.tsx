"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { ProjectLinks } from "@/components/sections/shared/ProjectLinks";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ProjectCategory, ProjectSummary } from "@/types/project";

const categories = ["all", "web", "mobile", "automation"] as const;
type CategoryFilter = (typeof categories)[number];

// Cores das tiras sem capa. A 3ª usa o card escuro em qualquer tema
// (classe "dark" local) para o texto branco manter contraste.
const fallbackTones = ["bg-primary", "bg-secondary", "dark bg-card"];

type ProjectsArchiveProps = {
  projects: ProjectSummary[];
  archiveLabel: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

// Arquivo de projetos em tiras verticais (estilo pastas). No desktop a tira
// ativa expande ao passar o mouse/focar; no mobile todas ficam abertas.
export function ProjectsArchive({ projects, archiveLabel }: ProjectsArchiveProps) {
  const t = useTranslations("project");
  const tPage = useTranslations("projectsPage");
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const stripsRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const result: Record<CategoryFilter, number> = { all: projects.length, web: 0, mobile: 0, automation: 0 };
    for (const project of projects) {
      if (project.category) result[project.category as ProjectCategory] += 1;
    }
    return result;
  }, [projects]);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const currentId = visible.some((p) => p.id === activeId) ? activeId : visible[0]?.id;
  const currentIndex = Math.max(0, visible.findIndex((p) => p.id === currentId));

  // Setas ← → movem o foco entre as tiras
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const links = [...(stripsRef.current?.querySelectorAll<HTMLAnchorElement>("[data-strip-link]") ?? [])];
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (index === -1) return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? index + 1 : index - 1;
    links[(next + links.length) % links.length]?.focus();
  }

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
        <div
          ref={stripsRef}
          onKeyDown={handleKeyDown}
          className="flex flex-col gap-3 md:h-[clamp(460px,calc(100dvh-23rem),740px)] md:flex-row md:gap-2"
        >
          {/* Lombada do arquivo */}
          <div
            aria-hidden
            className="hidden w-20 shrink-0 flex-col justify-between rounded-2xl bg-primary p-4 text-white md:flex lg:w-24"
          >
            <span className="rotate-180 text-2xl font-bold tracking-tight [writing-mode:vertical-rl]">
              {archiveLabel}
            </span>
            <span className="flex flex-col items-center gap-3">
              <span className="font-mono text-xs tabular-nums">
                {pad(currentIndex + 1)}
                <span className="block text-white/40">/{pad(visible.length)}</span>
              </span>
              <span className="font-mono text-[10px] leading-relaxed text-white/60 [writing-mode:vertical-rl]">
                {siteConfig.domain}
              </span>
            </span>
          </div>

          {visible.map((project, index) => {
            const isActive = project.id === currentId;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * index, ease: "easeOut" }}
                onMouseEnter={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
                className={cn(
                  "group relative isolate flex h-100 overflow-hidden rounded-2xl text-white md:h-auto md:min-w-20 md:basis-0 md:transition-[flex-grow] md:duration-500 md:ease-out motion-reduce:transition-none",
                  isActive ? "md:grow-[6]" : "md:grow",
                  !project.coverUrl && fallbackTones[index % fallbackTones.length],
                )}
              >
                {project.coverUrl ? (
                  <>
                    <Image
                      src={project.coverUrl}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 60vw, 100vw"
                      className={cn(
                        "-z-10 object-cover object-top transition-[filter] duration-500",
                        !isActive && "md:grayscale",
                      )}
                    />
                    {/* Escurece a captura para o texto branco ficar legível */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 -z-10 transition-colors duration-500",
                        isActive ? "bg-linear-to-t from-black/90 via-black/45 to-black/10" : "bg-primary/75",
                      )}
                    />
                  </>
                ) : (
                  <>
                    <span aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-30" />
                    {/* Arte tipográfica com a stack do projeto */}
                    <span
                      aria-hidden
                      className="absolute inset-x-6 top-16 bottom-0 -z-10 flex flex-col overflow-hidden text-5xl leading-[0.95] font-bold tracking-tighter whitespace-nowrap text-white/[0.07] select-none [mask-image:linear-gradient(to_bottom,black_30%,transparent_65%)] lg:text-7xl"
                    >
                      {project.techStack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </span>
                  </>
                )}

                {/* Aba da pasta com o número */}
                <span
                  aria-hidden
                  className="absolute top-0 right-4 flex h-16 w-8 justify-center rounded-b-xl bg-black/25 pt-2.5 font-mono text-[11px] backdrop-blur-sm [writing-mode:vertical-rl]"
                >
                  {pad(index + 1)}
                </span>

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
                    "mt-auto flex w-full flex-col gap-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 pt-20 transition-all duration-500 md:min-w-88 lg:p-8",
                    isActive
                      ? "md:translate-y-0 md:opacity-100 md:delay-200"
                      : "md:pointer-events-none md:translate-y-4 md:opacity-0",
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
                  {project.techStack.length > 0 ? (
                    <span className="font-mono text-xs text-white/70">{project.techStack.join(" · ")}</span>
                  ) : null}
                  <span className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {/* Link do case com área de clique cobrindo a tira inteira */}
                    <Link
                      data-strip-link
                      href={{ pathname: "/projetos/[slug]", params: { slug: project.slug } }}
                      className="inline-flex items-center gap-1.5 text-sm font-medium after:absolute after:inset-0 after:rounded-2xl"
                    >
                      {t("openCase")}
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </Link>
                    <ProjectLinks
                      tone="inverted"
                      className="relative z-10"
                      demoUrl={project.demoUrl}
                      repoUrl={project.repoUrl}
                      labels={{ deploy: t("deploy"), github: t("github"), soon: t("soon") }}
                    />
                  </span>
                </span>
              </motion.article>
            );
          })}

          {/* Espaço reservado para os próximos projetos */}
          {filter === "all" ? (
            <motion.div
              aria-hidden
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * visible.length, ease: "easeOut" }}
              className="flex h-20 shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-sm text-muted-foreground md:h-auto md:w-20 md:flex-col md:justify-between md:py-6"
            >
              <Plus className="size-4" />
              <span className="font-medium md:rotate-180 md:[writing-mode:vertical-rl]">{tPage("soon")}</span>
            </motion.div>
          ) : null}
        </div>
      )}
    </div>
  );
}
