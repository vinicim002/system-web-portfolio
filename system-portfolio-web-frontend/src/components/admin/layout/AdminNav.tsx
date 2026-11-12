"use client";

import { ExternalLink, FolderKanban, LayoutDashboard, Server } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", key: "home", icon: LayoutDashboard, exact: true },
  { href: "/admin/projetos", key: "projects", icon: FolderKanban, exact: false },
  { href: "/admin/sistemas", key: "systems", icon: Server, exact: false },
] as const;

const linkClass =
  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

type AdminNavProps = {
  // Chamado ao navegar (fecha o menu no celular)
  onNavigate?: () => void;
};

// Menu do admin: Início só na rota exata; Projetos e Sistemas incluem as subrotas (RF-003).
// Em rotas com parâmetro o caminho só existe na requisição; o fallback mostra o mesmo menu
// sem item marcado até o caminho chegar, sem bloquear o pré-render.
export function AdminNav(props: AdminNavProps) {
  return (
    <Suspense fallback={<NavList {...props} pathname={null} />}>
      <CurrentNav {...props} />
    </Suspense>
  );
}

function CurrentNav(props: AdminNavProps) {
  const pathname = usePathname();
  return <NavList {...props} pathname={pathname} />;
}

function NavList({ onNavigate, pathname }: AdminNavProps & { pathname: string | null }) {
  const t = useTranslations("admin.nav");

  return (
    <nav aria-label={t("label")} className="flex flex-col gap-1">
      {items.map(({ href, key, icon: Icon, exact }) => {
        const isActive =
          pathname !== null &&
          (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(linkClass, isActive && "bg-muted text-foreground")}
          >
            <Icon className={cn("size-4", isActive && "text-accent-text")} aria-hidden />
            {t(key)}
          </Link>
        );
      })}

      <div className="my-2 h-px bg-border" role="separator" />

      <a href="/pt" target="_blank" rel="noopener noreferrer" className={linkClass} onClick={onNavigate}>
        <ExternalLink className="size-4" aria-hidden />
        {t("viewSite")}
        <span className="sr-only">{t("newTab")}</span>
      </a>
    </nav>
  );
}
