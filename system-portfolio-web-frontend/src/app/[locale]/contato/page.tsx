import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { siteConfig } from "@/config/site";
import { getActiveSocials } from "@/config/social";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/contato">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return { title: t("title"), description: t("description") };
}

// Remove protocolo e barra final para exibir o link de forma limpa
function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contato">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const tHome = await getTranslations("home");
  const socials = getActiveSocials();

  const details = [
    { label: t("linkedin"), value: displayUrl(siteConfig.social.linkedin), href: siteConfig.social.linkedin },
    { label: t("github"), value: displayUrl(siteConfig.social.github), href: siteConfig.social.github },
    { label: t("site"), value: siteConfig.domain, href: `https://${siteConfig.domain}` },
    ...(siteConfig.email
      ? [{ label: t("email"), value: siteConfig.email, href: `mailto:${siteConfig.email}` }]
      : []),
    { label: t("location"), value: tHome("location.place"), href: null },
  ];

  return (
    <main>
      <Container className="grid gap-12 pt-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:pt-16">
        <section className="flex flex-col gap-10">
          <header>
            <h1 className="text-5xl tracking-tighter sm:text-6xl lg:text-7xl">{t("title")}</h1>
            <p className="mt-4 max-w-md text-muted-foreground lg:text-lg">{t("subtitle")}</p>
          </header>

          <dl className="flex flex-col gap-5">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="mt-0.5 font-medium">
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-accent-text hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="mb-3 text-xs text-muted-foreground">{t("follow")}</p>
            <ul className="flex gap-2">
              {socials.map(({ key, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={tHome(`social.${key}`)}
                    className="flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label={t("form.submit")}>
          <ContactForm />
        </section>
      </Container>
    </main>
  );
}
