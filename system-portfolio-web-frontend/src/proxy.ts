import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// i18n nas rotas públicas. A proteção do /admin entra aqui na etapa 5.
export default createMiddleware(routing);

export const config = {
  // Ignora admin (sem i18n), arquivos estáticos e internos do Next
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
