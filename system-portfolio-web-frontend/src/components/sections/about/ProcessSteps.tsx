import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { processSteps } from "@/config/stack";

export async function ProcessSteps() {
  const t = await getTranslations("about.process");

  return (
    <section aria-labelledby="process-title" className="flex flex-col gap-6">
      <h2 id="process-title" className="text-3xl tracking-tight lg:text-4xl">{t("title")}</h2>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <li key={step} className="flex flex-col gap-3 border-t-2 border-border pt-4 first:border-secondary">
            <span className="font-mono text-xs text-accent-text">0{index + 1}</span>
            <h3 className="text-base">{t(`steps.${step}.title`)}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{t(`steps.${step}.text`)}</p>
          </li>
        ))}
      </ol>

      <p className="flex items-start gap-3 rounded-2xl bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
        {t("ai")}
      </p>
    </section>
  );
}
