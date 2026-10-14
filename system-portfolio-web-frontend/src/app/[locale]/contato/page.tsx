import { ArrowUpRight, Globe, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CardWaves } from "@/components/effects/CardWaves";
import { PaperPlane } from "@/components/effects/PaperPlane";
import { GithubIcon, GmailIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
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

type ContactChannel = {
  label: string;
  value: string;
  href: string | null;
  icon: React.ReactNode;
};

// Card de um canal de contato (link externo ou só informação)
function ChannelCard({ label, value, href, icon }: ContactChannel) {
  const content = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-accent-text transition-colors group-hover:bg-secondary group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block truncate font-medium">{value}</span>
      </span>
      {href ? (
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-text"
          aria-hidden
        />
      ) : null}
    </>
  );

  const className =
    "group flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-md transition-all";

  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`${className} hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-[0_8px_32px_-12px] hover:shadow-secondary/60`}
    >
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contato">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const tHome = await getTranslations("home");
  // LinkedIn e GitHub já aparecem nos cards; aqui só as demais redes
  const otherSocials = getActiveSocials().filter(({ key }) => key !== "linkedin" && key !== "github");

  const channels: ContactChannel[] = [
    {
      label: t("linkedin"),
      value: displayUrl(siteConfig.social.linkedin),
      href: siteConfig.social.linkedin,
      icon: <LinkedinIcon className="size-4.5" />,
    },
    {
      label: t("github"),
      value: displayUrl(siteConfig.social.github),
      href: siteConfig.social.github,
      icon: <GithubIcon className="size-4.5" />,
    },
    ...(siteConfig.email
      ? [
          {
            label: t("email"),
            value: siteConfig.email,
            href: `mailto:${siteConfig.email}`,
            icon: <GmailIcon className="size-4.5" />,
          },
        ]
      : []),
    {
      label: t("site"),
      value: siteConfig.domain,
      href: `https://${siteConfig.domain}`,
      icon: <Globe className="size-4.5" aria-hidden />,
    },
    {
      label: t("location"),
      value: tHome("location.place"),
      href: null,
      icon: <MapPin className="size-4.5" aria-hidden />,
    },
  ];

  return (
    // Vai de trás do header (-mt-20) até o rodapé (-mb-16) e ocupa ao menos a tela toda
    <main className="relative isolate -mt-20 -mb-16 min-h-dvh pt-20 pb-16">
      {/* Fundo de ondas na página inteira, na cor do fundo e com pouco esmaecimento */}
      <CardWaves surface="--background" fade={0.08} />
      <Container className="grid gap-12 pt-6 pb-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pt-14 lg:pb-20">
        <section className="relative isolate flex flex-col gap-10">
          {/* Avião voando por trás do título */}
          <PaperPlane className="absolute -top-10 left-0 -z-10 aspect-700/460 w-full max-w-190 lg:-left-6 lg:w-[calc(100%+3rem)]" />

          <header className="flex flex-col gap-5">
            <h1 className="text-6xl leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">
              {t.rich("title", {
                accent: (chunks) => <span className="block text-accent-text">{chunks}</span>,
              })}
            </h1>
            <p className="max-w-md text-muted-foreground lg:text-lg">{t("subtitle")}</p>
          </header>

          <ul className="grid gap-3 sm:grid-cols-2">
            {channels.map((channel) => (
              <li key={channel.label}>
                <ChannelCard {...channel} />
              </li>
            ))}
          </ul>

          {otherSocials.length > 0 ? (
            <div>
              <p className="mb-3 text-xs text-muted-foreground">{t("follow")}</p>
              <ul className="flex gap-2">
                {otherSocials.map(({ key, href, Icon }) => (
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
          ) : null}
        </section>

        <section aria-labelledby="contact-form-title" className="relative isolate lg:mt-4">
          {/* Brilho atrás do card do formulário */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-[3rem] lg:-inset-6 bg-secondary/15 blur-3xl dark:bg-secondary/20"
          />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-primary/10 sm:p-8 lg:p-10 dark:shadow-black/40">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-secondary/25 blur-3xl"
            />
            <header className="relative mb-8 flex flex-col gap-2">
              <h2 id="contact-form-title" className="text-2xl tracking-tight lg:text-3xl">
                {t("formTitle")}
              </h2>
              <p className="text-sm text-muted-foreground">{t("formSubtitle")}</p>
            </header>
            <div className="relative">
              <ContactForm />
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
