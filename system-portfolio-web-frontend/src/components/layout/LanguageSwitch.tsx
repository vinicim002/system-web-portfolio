"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitch() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function changeLocale(nextLocale: (typeof routing.locales)[number]) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- os params já correspondem à rota atual
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex h-11 items-center gap-1 rounded-xl bg-background p-1 text-xs font-medium"
    >
      {routing.locales.map((item) => (
        <button
          key={item}
          type="button"
          lang={item}
          aria-label={t(item)}
          aria-pressed={item === locale}
          disabled={isPending}
          onClick={() => changeLocale(item)}
          className={cn(
            "h-full min-w-10 rounded-lg px-2.5 lowercase transition-colors",
            item === locale
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
