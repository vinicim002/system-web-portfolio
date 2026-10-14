import { getTranslations } from "next-intl/server";
import { GlowCard } from "@/components/sections/shared/GlowCard";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

// Mínimo de itens por metade do loop, para cobrir telas largas sem buraco
const MIN_ITEMS = 8;

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Repete até preencher e duplica a sequência para o loop ficar contínuo
  const base = Array.from({ length: Math.ceil(MIN_ITEMS / items.length) }, () => items).flat();
  const loop = [...base, ...base];
  return (
    <div className="relative flex overflow-hidden">
      <ul
        className={cn(
          "flex shrink-0 gap-4 pr-4",
          reverse ? "motion-safe:animate-marquee-reverse" : "motion-safe:animate-marquee",
        )}
      >
        {loop.map((item, index) => (
          <li
            key={`${item}-${index}`}
            aria-hidden={index >= items.length}
            className="flex shrink-0 items-center gap-2 rounded-full border border-dashed border-muted-foreground/40 bg-background/50 px-4 py-2 text-sm whitespace-nowrap"
          >
            <span className="size-1.5 rounded-full bg-secondary" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Faixa rolando com os temas em estudo (estilo "App Integrations")
export async function StudyingList() {
  const t = await getTranslations("about.studying");
  const items = t.raw("items") as string[];
  const half = Math.ceil(items.length / 2);

  return (
    <section aria-labelledby="studying-title" className="flex flex-col gap-6">
      <SectionHeader id="studying-title" title={t("title")} />

      <GlowCard className="gap-10 px-0 lg:px-0" glowClassName="-top-24 left-1/2 h-48 w-2/3 -translate-x-1/2">
        <div className="flex flex-col gap-4 py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <MarqueeRow items={items.slice(0, half)} />
          <MarqueeRow items={items.slice(half)} reverse />
        </div>
        <p className="px-6 text-sm leading-relaxed text-muted-foreground lg:px-8">{t("subtitle")}</p>
      </GlowCard>
    </section>
  );
}
