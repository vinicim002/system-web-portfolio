import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";
import { LocalTime } from "./LocalTime";

export async function LocationCard({ className }: { className?: string }) {
  const t = await getTranslations("home.location");

  return (
    <BentoCard className={cn("min-h-36", className)} aria-label={t("title")}>
      <div aria-hidden className="bg-dots absolute inset-0 [mask-image:radial-gradient(circle_at_75%_50%,black,transparent_70%)]" />
      <span
        aria-hidden
        className="absolute top-1/2 right-[22%] flex size-3 -translate-y-1/2"
      >
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-3 rounded-full bg-secondary" />
      </span>

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
