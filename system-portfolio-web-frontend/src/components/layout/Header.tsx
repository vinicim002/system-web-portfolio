import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { LanguageSwitch } from "./LanguageSwitch";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

export const navItems = [
  { href: "/sobre", key: "about" },
  { href: "/projetos", key: "projects" },
  { href: "/contato", key: "contact" },
] as const;

export async function Header() {
  const t = await getTranslations("nav");

  return (
    <header>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {siteConfig.name.toLowerCase()}
          <span className="text-accent-text">.</span>
        </Link>

        <nav aria-label={t("main")} className="hidden sm:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{t(item.key)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
