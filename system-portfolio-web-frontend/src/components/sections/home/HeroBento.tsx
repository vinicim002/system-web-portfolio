import type { Locale } from "next-intl";
import { BadgeCard } from "./BadgeCard";
import { IntroCard } from "./IntroCard";
import { LatestProjectsCard } from "./LatestProjectsCard";
import { LocationCard } from "./LocationCard";
import { SocialCard } from "./SocialCard";

// Bento da home. A ordem no DOM é a ordem no mobile;
// no desktop cada card é posicionado no grid de 3 colunas.
export function HeroBento({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:h-full lg:min-h-[680px] lg:grid-cols-[1fr_1.25fr_1fr] lg:grid-rows-[auto_1fr_auto]">
      <IntroCard className="lg:col-start-1 lg:row-span-2 lg:row-start-1" />
      <BadgeCard className="md:row-span-2 lg:col-start-2 lg:row-span-3 lg:row-start-1" />
      <SocialCard className="lg:col-start-3 lg:row-start-1" />
      <LatestProjectsCard
        locale={locale}
        className="lg:col-start-3 lg:row-span-2 lg:row-start-2"
      />
      <LocationCard className="md:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-3" />
    </div>
  );
}
