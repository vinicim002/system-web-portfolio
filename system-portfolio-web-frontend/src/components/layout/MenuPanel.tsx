"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { getActiveSocials } from "@/config/social";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "./LanguageSwitch";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

const pages = [
  { href: "/", key: "home" },
  { href: "/sobre", key: "about" },
  { href: "/projetos", key: "projects" },
  { href: "/contato", key: "contact" },
] as const;

// Menu do header (estilo eddie.eco): botão + CTA que se expandem num painel
export function MenuPanel() {
  const t = useTranslations("nav");
  const tSocial = useTranslations("home.social");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const socials = getActiveSocials();

  // Fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <motion.div
      ref={panelRef}
      layout
      transition={{ type: "spring", stiffness: 420, damping: 36 }}
      className={cn(
        "pointer-events-auto overflow-hidden rounded-2xl border border-border bg-card/85 p-1.5 shadow-lg shadow-black/5 backdrop-blur-md",
        open && "w-[min(18rem,calc(100vw-2rem))] bg-card/95",
      )}
    >
      <motion.div layout="position" className="flex gap-1.5">
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
            open ? "bg-accent-text text-white dark:text-primary" : "bg-background hover:text-accent-text",
          )}
        >
          {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
        </button>
        <Link
          href="/contato"
          onClick={close}
          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-opacity hover:opacity-90 dark:bg-secondary"
        >
          {t("cta")}
        </Link>
      </motion.div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={menuId}
            key="menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <nav aria-label={t("main")} className="flex flex-col gap-5 px-3 pt-5 pb-4">
              <div>
                <p className="mb-2 text-lg text-muted-foreground">{t("pages")}</p>
                <ul className="flex flex-col gap-1">
                  {pages.map((page) => (
                    <li key={page.href}>
                      <NavLink
                        href={page.href}
                        onClick={close}
                        className="text-lg font-bold text-foreground/90 hover:text-accent-text aria-[current=page]:text-accent-text"
                      >
                        {t(page.key)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              {socials.length > 0 ? (
                <div>
                  <p className="mb-2 text-lg text-muted-foreground">{t("social")}</p>
                  <ul className="flex flex-col gap-1">
                    {socials.map(({ key, href }) => (
                      <li key={key}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={close}
                          className="group inline-flex items-center gap-1 text-lg font-bold text-foreground/90 transition-colors hover:text-accent-text"
                        >
                          {tSocial(key)}
                          <ArrowUpRight className="size-4 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </nav>

            <div className="flex gap-1.5">
              <ThemeToggle />
              <LanguageSwitch />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
