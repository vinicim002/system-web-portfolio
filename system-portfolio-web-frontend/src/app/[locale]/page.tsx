import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HeroBento } from "@/components/sections/home/HeroBento";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // No desktop o bento ocupa a altura da tela menos o header (h-16)
  return (
    <main className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:h-[calc(100dvh-4rem)] lg:px-8 lg:pb-6">
      <HeroBento locale={locale} />
    </main>
  );
}
