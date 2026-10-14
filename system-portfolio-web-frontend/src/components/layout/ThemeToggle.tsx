"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

// Botão de tema no estilo do menu (pílula com ícone e rótulo)
export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={t("toggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-background px-4 text-xs font-medium transition-colors hover:text-accent-text"
    >
      {/* Ícones trocados via CSS para evitar diferença de hidratação */}
      <Sun className="size-4 dark:hidden" aria-hidden />
      <Moon className="hidden size-4 dark:block" aria-hidden />
      {t("label")}
    </button>
  );
}
