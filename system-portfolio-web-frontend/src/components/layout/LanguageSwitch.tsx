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
      className="flex h-8 items-center rounded-lg border border-border p-0.5 text-xs font-medium"
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
            "h-full rounded-md px-2 uppercase transition-colors",
            item === locale
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
