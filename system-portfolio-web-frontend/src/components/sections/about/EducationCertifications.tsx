import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { GlowCard } from "@/components/sections/shared/GlowCard";
import { certifications, education } from "@/config/career";
import { PlaceholderBadge } from "./PlaceholderBadge";

const iconChip =
  "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white shadow-[0_0_36px_-4px] shadow-secondary/80 ring-1 ring-white/20";

// Formação e certificações lado a lado
export async function EducationCertifications() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as "pt" | "en";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section aria-labelledby="education-title">
        <GlowCard className="h-full gap-6" glowClassName="-top-16 -left-10 h-40 w-40">
          <div className="flex items-center gap-4">
            <span className={iconChip}>
              <GraduationCap className="size-5" aria-hidden />
            </span>
            <h2 id="education-title" className="text-2xl tracking-tight lg:text-3xl">
              {t("education.title")}
            </h2>
          </div>

          <ul className="flex flex-col divide-y divide-border">
            {education.map((item) => (
              <li key={`${item.institution}-${item.period}`} className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0">
                <span className="text-lg font-medium">{item.course[locale]}</span>
                <span className="text-sm text-muted-foreground">
                  {item.institution} · <span className="font-mono">{item.period}</span>
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">{item.status[locale]}</span>
                  {item.placeholder ? <PlaceholderBadge /> : null}
                </span>
              </li>
            ))}
          </ul>
        </GlowCard>
      </section>

      <section aria-labelledby="certifications-title">
        <GlowCard className="h-full gap-6" glowClassName="-top-16 right-0 h-40 w-40">
          <div className="flex items-center gap-4">
            <span className={iconChip}>
              <Award className="size-5" aria-hidden />
            </span>
            <h2 id="certifications-title" className="text-2xl tracking-tight lg:text-3xl">
              {t("certifications.title")}
            </h2>
          </div>

          <ul className="flex flex-col divide-y divide-border">
            {certifications.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.issuer} · <span className="font-mono">{item.year}</span>
                  </span>
                  {item.placeholder ? <PlaceholderBadge /> : null}
                </span>
                {item.credentialUrl ? (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${t("certifications.credential")}: ${item.name}`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:border-secondary hover:text-accent-text"
                  >
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </GlowCard>
      </section>
    </div>
  );
}
