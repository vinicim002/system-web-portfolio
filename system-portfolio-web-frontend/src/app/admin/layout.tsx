import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { AdminQueryProvider } from "@/components/admin/providers/AdminQueryProvider";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import messages from "../../../messages/pt.json";
import "../globals.css";

// Layout raiz do admin: fora das rotas com idioma, só em português e fora da busca (RF-025)
export const metadata: Metadata = {
  title: { default: messages.admin.meta.title, template: `%s · ${messages.admin.meta.title}` },
  description: messages.admin.meta.description,
  robots: { index: false, follow: false, nocache: true },
};

// Só o namespace "admin" vai para o navegador
const adminMessages = { admin: messages.admin };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Fixa o idioma sem ler a requisição, para as telas serem geradas estaticamente
  setRequestLocale("pt");

  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: extensões do navegador injetam atributos no body */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <NextIntlClientProvider locale="pt" messages={adminMessages} timeZone="America/Sao_Paulo">
          <Providers>
            <AdminQueryProvider>
              {children}
              <Toaster position="bottom-right" richColors={false} />
            </AdminQueryProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
