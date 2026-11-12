"use client";

import { FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";

// Aviso de que os números da central de sistemas são de exemplo (spec 002, RF-018)
export function SampleDataNotice() {
  const t = useTranslations("admin");

  return (
    <p
      role="note"
      className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground"
    >
      <FlaskConical className="size-3.5 shrink-0 text-accent-text" aria-hidden />
      {t("sampleNotice")}
    </p>
  );
}
