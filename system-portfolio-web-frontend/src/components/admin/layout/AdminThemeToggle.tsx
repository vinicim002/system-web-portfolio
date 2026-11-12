"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Mesmo comportamento do ThemeToggle do site, com o texto do namespace "admin"
export function AdminThemeToggle() {
  const t = useTranslations("admin.shell");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label={t("toggleTheme")}
      title={t("toggleTheme")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Ícones trocados via CSS para evitar diferença de hidratação */}
      <Sun className="dark:hidden" aria-hidden />
      <Moon className="hidden dark:block" aria-hidden />
    </Button>
  );
}
