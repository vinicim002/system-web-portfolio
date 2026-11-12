"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MonitoredSystem, SystemHealth } from "@/types/admin";
import { SystemIcon } from "./SystemIcon";

// O texto do status sempre acompanha a cor (a cor nunca é a única informação)
const healthDot: Record<SystemHealth, string> = {
  up: "bg-secondary",
  degraded: "bg-muted-foreground",
  down: "bg-destructive",
};

// Card de um sistema na central (RF-007): no ar abre o painel; "em breve" não abre nada
export function SystemCard({ system }: { system: MonitoredSystem }) {
  const t = useTranslations("admin.systems");
  const format = useFormatter();
  const { sample } = system;

  if (system.state === "soon" || !sample) {
    return (
      <article className="flex h-full flex-col gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-5">
        <div className="flex items-center gap-3">
          <SystemIcon name={system.name} muted />
          <div className="min-w-0">
            <h3 className="truncate font-bold">{system.name}</h3>
            <Badge variant="outline" className="mt-1">
              <Clock aria-hidden />
              {t("state.soon")}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{t("soonHint")}</p>
      </article>
    );
  }

  return (
    <Link
      href={`/admin/sistemas/${system.slug}`}
      title={t("openPanel", { name: system.name })}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors outline-none hover:border-secondary/60 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-center gap-3">
        <SystemIcon name={system.name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{system.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className={cn("size-2 rounded-full", healthDot[sample.status])} aria-hidden />
            {t(`status.${sample.status}`)}
          </p>
        </div>
        <ArrowUpRight
          className="size-4 text-muted-foreground transition-colors group-hover:text-accent-text"
          aria-hidden
        />
      </div>

      <dl className="flex flex-col divide-y divide-border rounded-xl bg-muted px-3 text-sm">
        <Metric label={t("uptime")} value={`${format.number(sample.uptimePercent, { maximumFractionDigits: 1 })}%`} />
        <Metric label={t("visits")} value={format.number(sample.visitsLast7Days)} />
        <Metric label={t("threats")} value={format.number(sample.blockedThreatsLast7Days)} />
      </dl>

      <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {t("checkedAt", {
            date: format.dateTime(new Date(sample.checkedAt), { dateStyle: "short", timeStyle: "short" }),
          })}
        </span>
        <Badge variant="secondary" title={t("sampleHint")}>
          {t("sampleTag")}
        </Badge>
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-bold tabular-nums">{value}</dd>
    </div>
  );
}
