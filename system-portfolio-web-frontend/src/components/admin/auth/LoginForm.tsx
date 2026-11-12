"use client";

import { Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@/hooks/admin/use-admin-auth";
import { authErrorKey } from "./auth-error";

// Primeira etapa do acesso: e-mail e senha (RF-001, RF-006)
export function LoginForm() {
  const t = useTranslations("admin");
  const signIn = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-email">{t("login.email")}</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("login.emailPlaceholder")}
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-password">{t("login.password")}</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11"
        />
      </div>
      {signIn.isError && (
        <p role="alert" className="text-sm text-destructive">
          {t(`auth.errors.${authErrorKey(signIn.error)}`)}
        </p>
      )}
      {/* A sessão de uma conta sem acesso é encerrada na hora; o aviso fica guardado aqui (RF-002) */}
      {signIn.data?.step === "not_admin" && (
        <p role="alert" className="flex gap-2 rounded-xl bg-muted p-3 text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          {t("auth.notAdmin")}
        </p>
      )}
      <Button type="submit" size="lg" className="h-11" disabled={signIn.isPending}>
        {signIn.isPending && <Loader2 className="animate-spin" aria-hidden />}
        {signIn.isPending ? t("auth.signingIn") : t("login.submit")}
      </Button>
    </form>
  );
}
