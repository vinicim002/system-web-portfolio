import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { getActiveSocials } from "@/config/social";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { navItems } from "./Header";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tSocial = await getTranslations("home.social");
  const socials = getActiveSocials();

  return (
    <footer className="mt-16 overflow-hidden bg-primary text-white">
      <Container className="pt-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <p className="max-w-sm text-sm leading-relaxed text-white/70">{t("tagline")}</p>
            <ul className="flex gap-2">
              {socials.map(({ key, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={tSocial(key)}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={t("nav")}>
            <p className="mb-3 text-xs font-medium tracking-widest text-white/50 uppercase">{t("nav")}</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-white">{tNav("home")}</Link>
              </li>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/80 hover:text-white">
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-3 text-xs font-medium tracking-widest text-white/50 uppercase">{t("social")}</p>
            <ul className="flex flex-col gap-2 text-sm">
              {socials.map(({ key, href }) => (
                <li key={key}>
                  <a href={href} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">
                    {tSocial(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Marca gigante ocupando a largura do rodapé */}
        <p
          aria-hidden
          className="mt-12 text-[min(25.5vw,520px)] leading-[0.8] font-bold tracking-tighter select-none"
        >
          {siteConfig.name.toLowerCase()}
          <span className="text-secondary">.</span>
        </p>

        <div className="flex flex-col gap-2 border-t border-white/15 py-6 text-xs text-white/60 sm:flex-row sm:justify-between">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.fullName}. {t("rights")}
          </p>
          <p className="font-mono">{siteConfig.domain}</p>
        </div>
      </Container>
    </footer>
  );
}
