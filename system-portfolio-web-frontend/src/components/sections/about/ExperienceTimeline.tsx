import { getLocale, getTranslations } from "next-intl/server";
import { GlowCard } from "@/components/sections/shared/GlowCard";
import { experience, type ExperienceItem } from "@/config/career";
import { PlaceholderBadge } from "./PlaceholderBadge";
import { SectionHeader } from "./SectionHeader";

type AppLocale = "pt" | "en";

// "2026-05" → "mai/2026" (pt) ou "May 2026" (en)
function formatMonth(value: string, locale: AppLocale) {
  const [year, month] = value.split("-").map(Number);
  const name = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", {
    month: "short",
    timeZone: "UTC",
  })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace(".", "");
  return locale === "pt" ? `${name}/${year}` : `${name} ${year}`;
}

function periodOf(item: ExperienceItem, locale: AppLocale, currentLabel: string) {
  if (!item.start) return null;
  const end = item.current || !item.end ? currentLabel : formatMonth(item.end, locale);
  return `${formatMonth(item.start, locale)} — ${end}`;
}

// Linha do tempo de experiência profissional
export async function ExperienceTimeline() {
  const t = await getTranslations("about.experience");
  const locale = (await getLocale()) as AppLocale;

  return (
    <section aria-labelledby="experience-title" className="flex flex-col gap-6">
      <SectionHeader id="experience-title" title={t("title")} subtitle={t("subtitle")} />

      <ol className="flex flex-col gap-4">
        {experience.map((item, index) => {
          const period = periodOf(item, locale, t("current"));
          return (
            <li key={`${item.company}-${item.role.pt}`}>
              <GlowCard
                className="grid gap-6 md:grid-cols-[13rem_1fr] md:gap-10"
                glowClassName="-top-16 -left-10 h-40 w-56"
              >
                <div className="flex flex-col gap-2">
                  {period ? (
                    <span className="inline-flex items-center gap-2 font-mono text-sm text-accent-text">
                      {item.current ? <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden /> : null}
                      {period}
                    </span>
                  ) : null}
                  <span className="font-medium">{item.company}</span>
                  {item.placeholder ? <PlaceholderBadge /> : null}
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="pr-16 text-2xl tracking-tight lg:text-3xl">{item.role[locale]}</h3>
                  <ul className="flex max-w-2xl flex-col gap-2">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight.pt}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground before:mt-2 before:size-1.5 before:shrink-0 before:rounded-full before:bg-secondary lg:text-base"
                      >
                        <span>{highlight[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  {item.stack.length > 0 ? (
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {item.stack.map((tech) => (
                        <li key={tech} className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <span aria-hidden className="absolute top-6 right-6 font-mono text-5xl font-bold text-foreground/10 lg:top-8 lg:right-8">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </GlowCard>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
