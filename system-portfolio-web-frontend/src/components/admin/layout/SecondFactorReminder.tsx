"use client";

import { ShieldPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { GuardedLink } from "@/components/admin/shared/LeaveGuard";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/admin/use-admin-auth";

// Lembrete enquanto só existe um aparelho como segundo fator (RF-005)
export function SecondFactorReminder() {
  const t = useTranslations("admin.security");
  const { data: status } = useAuthStatus();

  if (status?.step !== "ready" || status.factorCount !== 1) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-muted p-4 text-sm sm:flex-row sm:items-center">
      <ShieldPlus className="size-5 shrink-0 text-accent-text" aria-hidden />
      <p className="flex-1">{t("reminder")}</p>
      <Button asChild variant="outline" className="self-start sm:self-auto">
        <GuardedLink href="/admin/seguranca">{t("reminderAction")}</GuardedLink>
      </Button>
    </div>
  );
}
