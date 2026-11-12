"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthStatus } from "@/hooks/admin/use-admin-auth";
import { safeReturnPath } from "@/lib/api/admin/auth-status";
import { LoginForm } from "./LoginForm";
import { MfaEnroll } from "./MfaEnroll";
import { MfaVerify } from "./MfaVerify";

// Escolhe a etapa do acesso: senha → cadastro do fator → código; pronto → volta para a tela pedida
export function LoginFlow() {
  const t = useTranslations("admin");
  const router = useRouter();
  const returnTo = safeReturnPath(useSearchParams().get("voltar"));
  const { data: status, isPending } = useAuthStatus();

  useEffect(() => {
    if (status?.step === "ready") router.replace(returnTo);
  }, [status, returnTo, router]);

  if (isPending || status?.step === "ready") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {t("auth.checking")}
      </p>
    );
  }

  if (status?.step === "enroll") {
    return (
      <Step title={t("auth.enrollTitle")}>
        <MfaEnroll />
      </Step>
    );
  }

  if (status?.step === "verify") {
    return (
      <Step title={t("auth.verifyTitle")}>
        <MfaVerify />
      </Step>
    );
  }

  // "Deslogado" e "não é admin" desenham o mesmo formulário no mesmo lugar: o React o mantém
  // montado e o aviso de acesso negado (guardado no próprio formulário) não some
  return (
    <Step title={t("login.title")} subtitle={t("login.subtitle")}>
      <LoginForm />
    </Step>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </>
  );
}
