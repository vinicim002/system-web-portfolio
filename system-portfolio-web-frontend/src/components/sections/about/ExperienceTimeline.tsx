import { getLocale, getTranslations } from "next-intl/server";
import { GlowCard } from "@/components/sections/shared/GlowCard";
import { experience } from "@/config/career";
import { PlaceholderBadge } from "./PlaceholderBadge";
import { SectionHeader } from "./SectionHeader";

// Linha do tempo de experiência profissional
export async function ExperienceTimeline() {
  const t = await getTranslations("about.experience");
  const locale = (await getLocale()) as "pt" | "en";

  return (
    <section aria-labelledby="experience-title" className="flex flex-col gap-6">
      <SectionHeader id="experience-title" title={t("title")} subtitle={t("subtitle")} />

      <ol className="flex flex-col gap-4">
        {experience.map((item, index) => (
          <li key={`${item.company}-${item.start}`}>
            <GlowCard
              className="grid gap-6 md:grid-cols-[13rem_1fr] md:gap-10"
              glowClassName="-top-16 -left-10 h-40 w-56"
            >
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 font-mono text-sm text-accent-text">
                  {item.end === null ? <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden /> : null}
                  {item.start} — {item.end ?? t("current")}
                </span>
                <span className="font-medium">{item.company}</span>
                {item.placeholder ? <PlaceholderBadge /> : null}
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-2xl tracking-tight lg:text-3xl">{item.role[locale]}</h3>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">
                  {item.description[locale]}
                </p>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <li key={tech} className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <span aria-hidden className="absolute top-6 right-6 font-mono text-5xl font-bold text-foreground/10 lg:top-8 lg:right-8">
                {String(index + 1).padStart(2, "0")}
              </span>
            </GlowCard>
          </li>
        ))}
      </ol>
    </section>
  );
}
