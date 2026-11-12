"use client";

import { KeyRound, LifeBuoy, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFactors } from "@/hooks/admin/use-admin-auth";
import { MfaEnroll } from "./MfaEnroll";

// Tela Segurança: fatores cadastrados, cadastrar outro e como recuperar o acesso (RF-005, RF-020)
export function SecurityPanel() {
  const t = useTranslations("admin");
  const format = useFormatter();
  const { data: factors, isPending } = useFactors();
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6" aria-labelledby="factors-title">
        <h2 id="factors-title" className="text-lg font-bold">
          {t("security.factorsTitle")}
        </h2>
        {isPending ? (
          <p className="mt-3 text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {(factors ?? []).map((factor) => (
              <li key={factor.id} className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                <ShieldCheck className="size-5 shrink-0 text-accent-text" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate font-medium">{factor.friendlyName}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("security.addedOn", { date: format.dateTime(new Date(factor.createdAt), { dateStyle: "long" }) })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6" aria-labelledby="add-factor-title">
        <h2 id="add-factor-title" className="text-lg font-bold">
          {t("security.addFactor")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("security.addFactorHint")}</p>
        <div className="mt-4 max-w-sm">
          {adding ? (
            <MfaEnroll
              defaultName=""
              onDone={() => {
                setAdding(false);
                toast.success(t("security.added"));
              }}
            />
          ) : (
            <Button type="button" variant="outline" size="lg" className="px-4" onClick={() => setAdding(true)}>
              <KeyRound aria-hidden />
              {t("security.addFactor")}
            </Button>
          )}
        </div>
      </section>

      <section className="flex gap-3 rounded-2xl border border-dashed border-border p-5 text-sm" aria-labelledby="recovery-title">
        <LifeBuoy className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
        <div>
          <h2 id="recovery-title" className="font-bold">
            {t("security.recoveryTitle")}
          </h2>
          <p className="mt-1 text-muted-foreground">{t("security.recoveryText")}</p>
        </div>
      </section>
    </div>
  );
}
