import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

// O admin ainda tem login só visual e dados de exemplo (princípio VII): fica fora do ar em
// produção até a autenticação real existir. Liga no `next dev` ou com ADMIN_ENABLED=true.
function isAdminEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.ADMIN_ENABLED === "true";
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // No Cloudflare o domínio pedido vem no cabeçalho Host (a URL interna pode ser outra)
  const host = (request.headers.get("host") ?? request.nextUrl.host).toLowerCase();

  // Um só endereço para o site: www redireciona para o domínio sem www
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (isAdminEnabled()) return NextResponse.next();
    // Mostra o "não encontrado" do site, como se a rota não existisse
    return NextResponse.rewrite(new URL("/pt/404", request.url));
  }

  // i18n nas rotas públicas
  return intl(request);
}

export const config = {
  // Ignora arquivos estáticos e internos do Next; o admin passa por aqui só para ser escondido
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
