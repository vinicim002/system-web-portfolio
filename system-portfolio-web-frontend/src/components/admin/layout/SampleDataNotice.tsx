"use client";

import { FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";

// Aviso fixo de que os dados são de exemplo e não são salvos (RF-005)
export function SampleDataNotice() {
  const t = useTranslations("admin");

  return (
    <p
      role="note"
      className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2 text-xs text-muted-foreground sm:px-6"
    >
      <FlaskConical className="size-3.5 shrink-0 text-accent-text" aria-hidden />
      {t("sampleNotice")}
    </p>
  );
}
