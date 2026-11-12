import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";
import en from "../../messages/en.json";
import pt from "../../messages/pt.json";
import "./globals.css";

// 404 de qualquer endereço que não bate com nenhuma rota (ex.: /.env, /wp-login.php, /x.xml).
// O site tem dois layouts raiz (público e admin), então este arquivo monta a página sozinho.
// Sem ele, esses endereços caíam numa rota sem layout e travavam o Worker no Cloudflare.
// Não dá para saber o idioma aqui: o texto vem em português e inglês.

const tPt = pt.globalNotFound;
const tEn = en.globalNotFound;

export const metadata: Metadata = {
  title: "404 · Vinicius Vila Nova",
  description: `${tPt.title} / ${tEn.title}`,
  robots: { index: false },
};

// Mesmo tema do site (next-themes guarda "light", "dark" ou "system" em localStorage.theme)
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="dark"||((!t||t==="system")&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function GlobalNotFound() {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground" suppressHydrationWarning>
        <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-8 px-4 py-16 sm:px-6">
          <p className="font-mono text-sm tracking-widest text-accent-text uppercase">{tPt.eyebrow}</p>
          <h1 className="text-7xl leading-[0.9] tracking-tighter sm:text-8xl">{tPt.title}</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {tPt.description}
            <span className="mt-1 block text-base" lang="en">
              {tEn.title}. {tEn.description}
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pt"
              className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {tPt.home}
            </Link>
            <Link
              href="/en"
              lang="en"
              className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {tEn.home}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
