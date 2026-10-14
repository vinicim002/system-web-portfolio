import { getTranslations } from "next-intl/server";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/icons/BrandIcons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";

// Distância do centro até cada vértice do hexágono (px)
const RADIUS = 88;

// Vértices de um hexágono com pontas na esquerda/direita, em graus
const networks = [
  { key: "youtube", Icon: YoutubeIcon, angle: 240 },
  { key: "instagram", Icon: InstagramIcon, angle: 300 },
  { key: "tiktok", Icon: TiktokIcon, angle: 180 },
  { key: "github", Icon: GithubIcon, angle: 0 },
  { key: "linkedin", Icon: LinkedinIcon, angle: 120 },
  { key: "x", Icon: XIcon, angle: 60 },
] as const;

function vertex(angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(radians) * RADIUS),
    y: Math.round(Math.sin(radians) * RADIUS),
  };
}

export async function SocialCard({ className }: { className?: string }) {
  const t = await getTranslations("home.social");

  return (
    <BentoCard className={cn("flex min-h-[248px] items-center justify-center", className)} aria-label={t("title")}>
      <div className="relative h-[200px] w-[240px]">
        {/* Linhas ligando o centro aos vértices */}
        <svg
          aria-hidden
          viewBox="-120 -100 240 200"
          className="absolute inset-0 size-full text-border"
        >
          {networks.map(({ key, angle }) => {
            const { x, y } = vertex(angle);
            return (
              <line
                key={key}
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeDasharray="2 4"
              />
            );
          })}
        </svg>

        {/* Núcleo do hub */}
        <span aria-hidden className="absolute top-1/2 left-1/2 flex size-4 -translate-1/2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary/50 motion-reduce:animate-none" />
          <span className="relative inline-flex size-4 rounded-full bg-secondary shadow-[0_0_24px_4px] shadow-secondary/50" />
        </span>

        <ul>
          {networks.map(({ key, Icon, angle }) => {
            const { x, y } = vertex(angle);
            const href = siteConfig.social[key];
            const tileClass =
              "flex size-11 items-center justify-center rounded-xl border border-border bg-background/60";

            return (
              <li
                key={key}
                className="absolute top-1/2 left-1/2"
                style={{ transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }}
              >
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t(key)}
                    className={cn(
                      tileClass,
                      "text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </a>
                ) : (
                  <span
                    role="img"
                    aria-label={`${t(key)} (${t("soon")})`}
                    title={t("soon")}
                    className={cn(tileClass, "text-muted-foreground/40")}
                  >
                    <Icon className="size-[18px]" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </BentoCard>
  );
}
