import { ArrowLeft, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { ProjectContent } from "@/components/sections/project/ProjectContent";
import { ProjectGallery } from "@/components/sections/project/ProjectGallery";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { ProjectLinks } from "@/components/sections/shared/ProjectLinks";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProjectBySlug } from "@/lib/api/projects";

type ProjectCaseProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Lê os params dentro do Suspense para a navegação mostrar o esqueleto na hora
export async function ProjectCase({ params }: ProjectCaseProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const project = await getProjectBySlug(locale, slug);
  if (!project) notFound();

  const t = await getTranslations("project");
  const linkLabels = { deploy: t("deploy"), github: t("github"), soon: t("soon") };
  // Capa + galeria, sem repetir a mesma imagem
  const images = [...new Set([project.coverUrl, ...project.galleryUrls].filter((url): url is string => Boolean(url)))];

  return (
    <Container className="flex flex-col gap-14 pt-6 lg:gap-20 lg:pt-10">
      <div className="flex flex-col gap-8">
        <Link
          href="/projetos"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("back")}
        </Link>

        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              {project.category ? (
                <span className="rounded-full bg-muted px-3 py-1">{t(`category.${project.category}`)}</span>
              ) : null}
              <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                {t(`status.${project.status}`)}
              </span>
            </div>
            <h1 className="text-5xl tracking-tighter sm:text-7xl lg:text-9xl">{project.title}</h1>
            {project.summary ? (
              <p className="max-w-3xl text-lg text-muted-foreground lg:text-2xl">{project.summary}</p>
            ) : null}
          </div>

          <ProjectLinks
            size="lg"
            className="shrink-0"
            demoUrl={project.demoUrl}
            repoUrl={project.repoUrl}
            labels={linkLabels}
          />
        </header>
      </div>

      <section aria-labelledby="gallery-title" className="flex flex-col gap-5">
        <h2 id="gallery-title" className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {t("gallery")}
        </h2>
        <ProjectGallery
          images={images}
          title={project.title}
          slug={project.slug}
          device={project.category === "mobile" ? "phone" : "browser"}
        />
      </section>

      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-20">
        <article className="max-w-3xl">
          {project.status === "proposal" ? (
            <p className="mb-8 flex items-start gap-3 rounded-2xl border border-border bg-muted p-4 text-sm leading-relaxed">
              <Info className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
              {t("proposalNote")}
            </p>
          ) : null}
          {project.content ? <ProjectContent content={project.content} /> : null}
        </article>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg">{t("details")}</h2>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">{t("statusLabel")}</dt>
                <dd className="mt-1 font-medium">{t(`status.${project.status}`)}</dd>
              </div>
              {project.category ? (
                <div>
                  <dt className="text-xs text-muted-foreground">{t("categoryLabel")}</dt>
                  <dd className="mt-1 font-medium">{t(`category.${project.category}`)}</dd>
                </div>
              ) : null}
            </dl>

            {project.techStack.length > 0 ? (
            <div>
              <h3 className="mb-3 text-xs text-muted-foreground">{t("stack")}</h3>
              <ul className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <li key={tech} className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            ) : null}

            <div>
              <h3 className="mb-3 text-xs text-muted-foreground">{t("linksLabel")}</h3>
              <ProjectLinks demoUrl={project.demoUrl} repoUrl={project.repoUrl} labels={linkLabels} />
            </div>
          </div>
        </aside>
      </div>

      <CtaBanner title={t("next")} button={t("contact")} waves />
    </Container>
  );
}
