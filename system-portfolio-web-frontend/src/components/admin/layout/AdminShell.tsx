"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LeaveGuardProvider } from "@/components/admin/shared/LeaveGuard";
import { AdminBrand } from "./AdminBrand";
import { AdminNav } from "./AdminNav";
import { AdminTopbar } from "./AdminTopbar";
import { SampleDataNotice } from "./SampleDataNotice";

// Moldura do admin: menu lateral no computador, gaveta no celular (RF-003, RF-023)
export function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin.shell");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <LeaveGuardProvider>
      <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[16rem_1fr]">
        <a
          href="#admin-content"
          className="sr-only z-50 rounded-lg bg-card px-3 py-2 text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t("skipToContent")}
        </a>

        <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-border bg-card px-3 py-4 lg:flex">
          <div className="px-1">
            <AdminBrand label={t("brand")} />
          </div>
          <AdminNav />
        </aside>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="left" showCloseButton={false} className="w-72 gap-6 bg-card px-3 py-4">
            <div className="flex items-center justify-between px-1">
              <SheetTitle asChild>
                <span className="sr-only">{t("menuTitle")}</span>
              </SheetTitle>
              <AdminBrand label={t("brand")} />
              <SheetClose asChild>
                <Button type="button" variant="ghost" size="icon-lg" aria-label={t("closeMenu")}>
                  <X aria-hidden />
                </Button>
              </SheetClose>
            </div>
            <AdminNav onNavigate={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-col">
          <SampleDataNotice />
          <AdminTopbar onOpenMenu={() => setMenuOpen(true)} />
          <main id="admin-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </LeaveGuardProvider>
  );
}
