"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = ComponentProps<typeof Link>;

// Link do menu que marca a página atual (inclui subrotas, ex.: /projetos/slug)
export function NavLink({ href, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const target = typeof href === "string" ? href : href.pathname;
  const isActive = pathname === target || pathname.startsWith(`${target}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "transition-colors hover:text-foreground",
        isActive && "text-foreground",
        className,
      )}
      {...props}
    />
  );
}
