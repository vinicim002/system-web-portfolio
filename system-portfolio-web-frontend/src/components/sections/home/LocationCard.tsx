import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";
import { LocalTime } from "./LocalTime";
import { RJ_CAPITAL, RJ_DOTS_PATH, RJ_DOT_STEP, RJ_VIEWBOX } from "./rj-dots";

export async function LocationCard({ className }: { className?: string }) {
  const t = await getTranslations("home.location");

  return (
    <BentoCard className={cn("min-h-36", className)} aria-label={t("title")}>
      {/* Estado do Rio de Janeiro em pontos, com a capital marcada */}
      <div
        aria-hidden
        className="absolute top-4 right-5 h-[60%] max-w-[62%] sm:h-[78%]"
        style={{ aspectRatio: `${RJ_VIEWBOX.width} / ${RJ_VIEWBOX.height}` }}
      >
        <svg
          viewBox={`0 0 ${RJ_VIEWBOX.width} ${RJ_VIEWBOX.height}`}
          className="size-full text-muted-foreground/40"
          fill="none"
        >
          <path
            d={RJ_DOTS_PATH}
            stroke="currentColor"
            strokeWidth={RJ_DOT_STEP * 0.62}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute flex size-3 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${RJ_CAPITAL.x}%`, top: `${RJ_CAPITAL.y}%` }}
        >
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-3 rounded-full bg-secondary" />
        </span>
      </div>

      <div className="relative flex h-full flex-col justify-end gap-1">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <MapPin className="size-4 text-accent-text" aria-hidden />
          {t("place")}
        </p>
        <p className="text-xs text-muted-foreground">
          <LocalTime timeZone={siteConfig.timeZone} /> · {t("localTime")}
        </p>
      </div>
    </BentoCard>
  );
}
