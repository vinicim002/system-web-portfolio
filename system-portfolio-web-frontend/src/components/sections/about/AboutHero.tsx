import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Barcode } from "@/components/sections/shared/Barcode";
import { siteConfig } from "@/config/site";

// Bloco de abertura no estilo pôster: título gigante com a foto encaixada na linha
export async function AboutHero() {
  const t = await getTranslations("about");

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-white sm:p-10 lg:p-14">
      <div className="flex items-center justify-between gap-4 text-white/70">
        <p className="font-mono text-xs">{siteConfig.domain}</p>
        <Barcode bars={16} className="h-6" />
      </div>

      <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
        <h1 className="text-[22vw] leading-[0.82] font-bold tracking-tighter lg:text-[min(12.5vw,15rem)]">
          <span className="block">{t("titleTop")}</span>
          <span className="flex items-center gap-[0.08em]">
            {t("titleBottom")}
            {siteConfig.avatarUrl ? (
              <span
                aria-hidden
                className="relative h-[0.72em] w-[1.6em] shrink-0 overflow-hidden rounded-[0.2em] ring-1 ring-white/20"
              >
                <Image
                  src={siteConfig.avatarUrl}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 400px, 40vw"
                  className="object-cover object-[50%_30%]"
                />
              </span>
            ) : null}
          </span>
        </h1>

        <div className="flex flex-col gap-6">
          <h2 className="text-3xl tracking-tight lg:text-4xl">{t("heading")}</h2>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-white/75 lg:text-base">
            <p>{t("bio1")}</p>
            <p>{t("bio2")}</p>
          </div>
          <figure className="border-l-2 border-secondary pl-4">
            <blockquote className="text-lg leading-snug font-medium italic lg:text-xl">
              “{t("quote")}”
            </blockquote>
            <figcaption className="mt-2 font-mono text-xs text-white/60">
              — {siteConfig.name}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
