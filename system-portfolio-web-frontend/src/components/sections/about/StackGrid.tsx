import { getTranslations } from "next-intl/server";
import { GlowCard, GlowCardText } from "@/components/sections/shared/GlowCard";
import { stackAreas } from "@/config/stack";
import { BackendOrbit } from "./illustrations/BackendOrbit";
import { DataQuery } from "./illustrations/DataQuery";
import { FrontendCursor } from "./illustrations/FrontendCursor";
import { InfraNetwork } from "./illustrations/InfraNetwork";
import { SectionHeader } from "./SectionHeader";

type AreaKey = (typeof stackAreas)[number]["key"];

function itemsOf(key: AreaKey) {
  return stackAreas.find((area) => area.key === key)?.items.join(" · ") ?? "";
}

// Bento no estilo da referência: 2 cards em cima (1:2) e 2 embaixo (1:1)
export async function StackGrid() {
  const t = await getTranslations("about.stack");

  return (
    <section aria-labelledby="stack-title" className="flex flex-col gap-6">
      <SectionHeader id="stack-title" title={t("title")} subtitle={t("subtitle")} />

      <div className="grid gap-4 lg:grid-cols-6">
        <GlowCard className="min-h-[340px] lg:col-span-2" glowClassName="top-6 left-1/2 h-40 w-2/3 -translate-x-1/2">
          <FrontendCursor label={t("frontendCta")} />
          <GlowCardText title={t("areas.frontend.title")} tag={t("areas.frontend.tag")} description={itemsOf("frontend")} />
        </GlowCard>

        <GlowCard className="min-h-[420px] sm:min-h-[340px] lg:col-span-4" glowClassName={null}>
          <BackendOrbit />
          <GlowCardText
            className="max-w-sm"
            title={t("areas.backend.title")}
            tag={t("areas.backend.tag")}
            description={itemsOf("backend")}
          />
        </GlowCard>

        <GlowCard className="min-h-[320px] lg:col-span-3" glowClassName="bottom-10 left-1/2 h-32 w-2/3 -translate-x-1/2">
          <DataQuery />
          <GlowCardText title={t("areas.data.title")} tag={t("areas.data.tag")} description={itemsOf("data")} />
        </GlowCard>

        <GlowCard className="min-h-[320px] lg:col-span-3" glowClassName="-top-20 left-1/3 h-40 w-1/2">
          <InfraNetwork />
          <GlowCardText title={t("areas.infra.title")} tag={t("areas.infra.tag")} description={itemsOf("infra")} />
        </GlowCard>
      </div>
    </section>
  );
}
