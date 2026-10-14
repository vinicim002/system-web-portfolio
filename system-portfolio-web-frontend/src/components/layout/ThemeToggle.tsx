"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={t("toggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Ícones trocados via CSS para evitar diferença de hidratação */}
      <Sun className="dark:hidden" aria-hidden />
      <Moon className="hidden dark:block" aria-hidden />
    </Button>
  );
}
