"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStatus } from "@/hooks/admin/use-admin-auth";

// Só mostra as telas com sessão de admin e segundo fator concluído (RF-007).
// Se a sessão cair depois de aberta, mantém a tela (e o formulário) e pede um novo login.
export function AuthGate({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin.auth");
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const { data: status } = useAuthStatus();
  const [wasReady, setWasReady] = useState(false);
  const ready = status?.step === "ready";
  const loginHref = `/admin/login?voltar=${encodeURIComponent(pathname + (search ? `?${search}` : ""))}`;

  if (ready && !wasReady) setWasReady(true);

  useEffect(() => {
    if (status && !ready && !wasReady) router.replace(loginHref);
  }, [status, ready, wasReady, loginHref, router]);

  if (!wasReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background" role="status">
        <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
        <span className="sr-only">{t("checking")}</span>
      </div>
    );
  }

  return (
    <>
      {children}
      <AlertDialog open={!ready}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("errors.session_expired")}</AlertDialogTitle>
            <AlertDialogDescription>{t("sessionExpiredHint")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.replace(loginHref)}>{t("goToLogin")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                window.open(loginHref, "_blank", "noopener");
              }}
            >
              {t("signInNewTab")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
