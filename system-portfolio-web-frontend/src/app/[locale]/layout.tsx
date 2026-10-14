import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers/Providers";
import { routing } from "@/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: { default: t("title"), template: "%s · Vinicius Vila Nova" },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Permite renderização estática com next-intl
  setRequestLocale(locale);

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: extensões do navegador injetam atributos no body */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <NextIntlClientProvider>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
