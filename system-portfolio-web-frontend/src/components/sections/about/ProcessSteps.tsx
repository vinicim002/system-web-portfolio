import { Code2, FlaskConical, MousePointer2, Rocket, Search, Sparkles, Workflow } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GlowCard, GlowCardText } from "@/components/sections/shared/GlowCard";
import { processSteps } from "@/config/stack";
import { SectionHeader } from "./SectionHeader";

const stepIcons = {
  discovery: Search,
  modeling: Workflow,
  build: Code2,
  tests: FlaskConical,
  deploy: Rocket,
} as const;

// Etapas em cards com ícone brilhante + card extra sobre o uso de IA
export async function ProcessSteps() {
  const t = await getTranslations("about.process");

  return (
    <section aria-labelledby="process-title" className="flex flex-col gap-6">
      <SectionHeader id="process-title" title={t("title")} />

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {processSteps.map((step, index) => {
          const Icon = stepIcons[step];
          return (
            <li key={step}>
              <GlowCard className="h-full min-h-60" glowClassName="-top-16 -left-10 h-40 w-40">
                <div className="mb-auto flex items-start justify-between pb-10">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-white shadow-[0_0_36px_-4px] shadow-secondary/80 ring-1 ring-white/20">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span
                    aria-hidden
                    className="bg-gradient-to-b from-foreground/25 to-transparent bg-clip-text font-mono text-6xl font-bold text-transparent"
                  >
                    0{index + 1}
                  </span>
                </div>
                <GlowCardText title={t(`steps.${step}.title`)} description={t(`steps.${step}.text`)} />
              </GlowCard>
            </li>
          );
        })}

        <li>
          <GlowCard className="h-full min-h-60 border-secondary/40" glowClassName="top-4 right-0 h-40 w-2/3">
            <div aria-hidden className="relative mb-auto flex justify-end pb-10">
              <span className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_40px_-4px] shadow-secondary ring-1 ring-white/25">
                <Sparkles className="size-4" />
                {t("aiLabel")}
              </span>
              <MousePointer2 className="absolute top-8 right-2 size-5 -scale-x-100 fill-white text-white motion-safe:animate-float" />
            </div>
            <GlowCardText title={t("aiTitle")} description={t("ai")} />
          </GlowCard>
        </li>
      </ol>
    </section>
  );
}
