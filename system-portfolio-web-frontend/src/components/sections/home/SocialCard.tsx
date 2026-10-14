import { getTranslations } from "next-intl/server";
import { GmailIcon } from "@/components/icons/BrandIcons";
import { siteConfig } from "@/config/site";
import { socialIcons } from "@/config/social";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";

// Distância do centro até cada vértice do hexágono (px)
const RADIUS = 92;

// Vértices de um hexágono com pontas na esquerda/direita, em graus (sentido horário)
const networks = [
  { key: "github", angle: 0 },
  { key: "x", angle: 60 },
  { key: "linkedin", angle: 120 },
  { key: "tiktok", angle: 180 },
  { key: "youtube", angle: 240 },
  { key: "instagram", angle: 300 },
] as const;

function vertex(angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(radians) * RADIUS),
    y: Math.round(Math.sin(radians) * RADIUS),
  };
}

const tileBase =
  "relative flex size-12 items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm";

// Hub hexagonal: redes nos vértices ligadas ao e-mail no centro
export async function SocialCard({ className }: { className?: string }) {
  const t = await getTranslations("home.social");
  const hexagon = networks.map(({ angle }) => {
    const { x, y } = vertex(angle);
    return `${x},${y}`;
  });

  return (
    <BentoCard
      waves
      className={cn("flex min-h-[260px] items-center justify-center", className)}
      aria-label={t("title")}
    >
      <div className="relative h-[220px] w-[250px]">
        {/* Contorno do hexágono */}
        <svg aria-hidden viewBox="-125 -110 250 220" className="absolute inset-0 size-full overflow-visible">
          <polygon
            points={hexagon.join(" ")}
            fill="none"
            stroke="var(--muted)"
            strokeOpacity="0.5"
            strokeWidth="1.25"
            strokeDasharray="3 5"
          />
        </svg>

        <ul>
          {networks.map(({ key, angle }) => {
            const { x, y } = vertex(angle);
            const href = siteConfig.social[key];
            const Icon = socialIcons[key];

            return (
              <li
                key={key}
                className="group absolute top-1/2 left-1/2"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {/* Linha do vértice até o centro, com fluxo animado nas redes ativas */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-0 left-0 h-px origin-left transition-opacity duration-300",
                    href
                      ? "bg-[repeating-linear-gradient(90deg,var(--secondary)_0_4px,transparent_4px_10px)] opacity-50 group-hover:opacity-100 motion-safe:animate-flow"
                      : "bg-[repeating-linear-gradient(90deg,var(--muted)_0_2px,transparent_2px_8px)] opacity-50",
                  )}
                  style={{ width: RADIUS, transform: `rotate(${angle + 180}deg)` }}
                />

                <div className="absolute top-0 left-0 -translate-1/2">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t(key)}
                      className={cn(
                        tileBase,
                        "text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:text-foreground hover:shadow-[0_0_28px_-4px] hover:shadow-secondary/70",
                      )}
                    >
                      <Icon className="size-[18px]" />
                    </a>
                  ) : (
                    <span
                      role="img"
                      aria-label={`${t(key)} (${t("soon")})`}
                      title={t("soon")}
                      className={cn(tileBase, "text-muted-foreground/45")}
                    >
                      <Icon className="size-[18px]" />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Centro: e-mail (sem endereço confirmado, leva à página de contato) */}
        <div className="absolute top-1/2 left-1/2 -translate-1/2">
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 size-28 -translate-1/2 rounded-full border border-dashed border-secondary/35 motion-safe:animate-spin-slow"
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 size-20 -translate-1/2 rounded-full border border-secondary/20"
          />
          {siteConfig.email ? (
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label={t("email")}
              className="relative flex size-16 items-center justify-center rounded-2xl border border-secondary/50 bg-card shadow-[0_0_40px_-6px] shadow-secondary/70 transition-transform duration-300 hover:scale-105"
            >
              <GmailIcon className="size-7" />
            </a>
          ) : (
            <Link
              href="/contato"
              aria-label={t("contact")}
              className="relative flex size-16 items-center justify-center rounded-2xl border border-secondary/50 bg-card shadow-[0_0_40px_-6px] shadow-secondary/70 transition-transform duration-300 hover:scale-105"
            >
              <GmailIcon className="size-7" />
            </Link>
          )}
        </div>
      </div>
    </BentoCard>
  );
}
