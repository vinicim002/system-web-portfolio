import { getTranslations } from "next-intl/server";
import { BentoCard } from "@/components/sections/home/BentoCard";
import { stackAreas } from "@/config/stack";
import { cn } from "@/lib/utils";

export async function StackGrid() {
  const t = await getTranslations("about.stack");

  return (
    <section aria-labelledby="stack-title" className="flex flex-col gap-6">
      <header>
        <h2 id="stack-title" className="text-3xl tracking-tight lg:text-4xl">{t("title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stackAreas.map((area, index) => (
          <BentoCard key={area.key} className={cn("flex flex-col gap-5", index === 0 && "border-secondary/60")}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg">{t(`areas.${area.key}.title`)}</h3>
              <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
            </div>
            <p className="text-xs font-medium text-accent-text">{t(`areas.${area.key}.tag`)}</p>
            <ul className="mt-auto flex flex-wrap gap-2">
              {area.items.map((item) => (
                <li key={item} className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </BentoCard>
        ))}
      </div>
    </section>
  );
}
