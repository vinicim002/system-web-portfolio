import { Hand } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";
import { DevBadge } from "./DevBadge";

export async function BadgeCard({ className }: { className?: string }) {
  const t = await getTranslations("home.badge");

  return (
    <BentoCard className={cn("flex min-h-[600px] flex-col items-center pt-0", className)}>
      <div aria-hidden className="bg-dots absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 size-80 -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl dark:bg-secondary/20"
      />

      <div className="relative">
        <DevBadge
          name={siteConfig.fullName}
          role={t("role")}
          label={t("label")}
          footer={siteConfig.domain}
          avatarUrl={siteConfig.avatarUrl}
        />
      </div>

      <div className="relative mt-auto pt-8 text-center">
        <p className="text-sm font-medium">{t("label")}</p>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Hand className="size-3.5" aria-hidden />
          {t("hint")}
        </p>
      </div>
    </BentoCard>
  );
}
