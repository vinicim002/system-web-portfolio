import { CodeXml } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { MenuPanel } from "./MenuPanel";

export const navItems = [
  { href: "/sobre", key: "about" },
  { href: "/projetos", key: "projects" },
  { href: "/contato", key: "contact" },
] as const;

// Header flutuante: marca à esquerda e menu expansível à direita.
// O header em si é transparente e não captura cliques; só as pílulas.
export function Header() {
  return (
    <header className="pointer-events-none sticky top-0 z-50">
      <Container className="flex h-20 items-start justify-between pt-3">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-border bg-card/85 p-1.5 pr-4 shadow-lg shadow-black/5 backdrop-blur-md transition-colors hover:border-secondary/50"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent-text text-white dark:text-primary">
            <CodeXml className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-bold tracking-tight">
            {siteConfig.name.toLowerCase()}
            <span className="text-accent-text">.</span>
          </span>
        </Link>

        <MenuPanel />
      </Container>
    </header>
  );
}
