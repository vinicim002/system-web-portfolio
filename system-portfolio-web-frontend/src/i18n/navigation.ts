import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers de navegação que já respeitam o idioma e as rotas traduzidas
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
