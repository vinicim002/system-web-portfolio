import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { ProcessSteps } from "@/components/sections/about/ProcessSteps";
import { StackGrid } from "@/components/sections/about/StackGrid";
import { StudyingList } from "@/components/sections/about/StudyingList";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/sobre">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/sobre">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("about.cta");

  return (
    <main>
      <Container className="flex flex-col gap-20 pt-2 lg:gap-28">
        <AboutHero />
        <StackGrid />
        <ProcessSteps />
        <StudyingList />
        <CtaBanner title={t("title")} button={t("button")} />
      </Container>
    </main>
  );
}
