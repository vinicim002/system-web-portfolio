"use client";

import { useTranslations } from "next-intl";
import { useAdminSystems } from "@/hooks/admin/use-admin-systems";
import { SystemCard } from "./SystemCard";

const gridClass = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

// Grade da central de sistemas, usada no Início e em Sistemas
export function SystemsGrid() {
  const t = useTranslations("admin");
  const { data, isPending, isError } = useAdminSystems();

  if (isPending) {
    return (
      <div className={gridClass} aria-busy="true" aria-label={t("common.loading")}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-56 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">{t("systems.loadError")}</p>;
  }

  return (
    <ul className={gridClass} aria-label={t("systems.gridLabel")}>
      {data.map((system) => (
        <li key={system.slug}>
          <SystemCard system={system} />
        </li>
      ))}
    </ul>
  );
}
