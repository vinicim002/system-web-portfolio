"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AdminBrand } from "./AdminBrand";
import { AdminThemeToggle } from "./AdminThemeToggle";

type AdminTopbarProps = {
  onOpenMenu: () => void;
};

// Barra superior: marca e botão de menu no celular; tema sempre visível (RF-004)
export function AdminTopbar({ onOpenMenu }: AdminTopbarProps) {
  const t = useTranslations("admin.shell");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        className="lg:hidden"
        aria-label={t("openMenu")}
        onClick={onOpenMenu}
      >
        <Menu aria-hidden />
      </Button>
      <div className="lg:hidden">
        <AdminBrand label={t("brand")} />
      </div>
      <div className="ml-auto">
        <AdminThemeToggle />
      </div>
    </header>
  );
}
