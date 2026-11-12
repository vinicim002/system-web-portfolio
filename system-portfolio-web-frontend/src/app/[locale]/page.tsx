import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { HeroBento } from "@/components/sections/home/HeroBento";
import { routing } from "@/i18n/routing";

// Montada a cada visita, como a página de projetos: sem casca pré-renderizada em cache, que no
// Cloudflare travava ao ser completada depois de o admin salvar. Os dados vêm do cache "projects".
export const instant = false;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await connection();
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // No desktop o bento ocupa a altura da tela menos o header (h-20)
  return (
    <main className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:h-[calc(100dvh-5rem)] lg:px-8 lg:pb-6">
      <HeroBento locale={locale} />
    </main>
  );
}
