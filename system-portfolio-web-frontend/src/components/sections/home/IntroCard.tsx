import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { BentoCard } from "./BentoCard";

export async function IntroCard({ className }: { className?: string }) {
  const t = await getTranslations("home.intro");

  return (
    <BentoCard className={className}>
      <div className="flex h-full flex-col gap-6 2xl:gap-8">
        <p className="font-mono text-xs text-muted-foreground">{siteConfig.domain}</p>

        <h1 className="text-4xl leading-[1.05] tracking-tight sm:text-5xl 2xl:text-7xl">
          {t("greeting")}
          <br />
          {t("name")}
        </h1>

        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground 2xl:text-base">
          {t("bio")}
        </p>

        <ul className="flex flex-wrap gap-2">
          {siteConfig.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium"
            >
              {skill}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button asChild size="lg" className="px-4">
            <Link href="/contato">{t("contact")}</Link>
          </Button>
          {siteConfig.cvUrl ? (
            <Button asChild size="lg" variant="outline" className="px-4">
              <a href={siteConfig.cvUrl} target="_blank" rel="noreferrer">
                {t("cv")}
              </a>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline" className="px-4">
              <Link href="/projetos">{t("projects")}</Link>
            </Button>
          )}
        </div>
      </div>
    </BentoCard>
  );
}
