"use client";

import { Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSignOut, useVerifyCode } from "@/hooks/admin/use-admin-auth";
import { authErrorKey } from "./auth-error";
import { CodeInput } from "./CodeInput";

// Segunda etapa do acesso: código do aplicativo autenticador (RF-003)
export function MfaVerify() {
  const t = useTranslations("admin.auth");
  const id = useId();
  const verify = useVerifyCode();
  const signOut = useSignOut();
  const [code, setCode] = useState("");

  function submit(value: string) {
    if (value.length !== 6 || verify.isPending) return;
    verify.mutate(value, { onError: () => setCode("") });
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit(code);
      }}
    >
      <p className="text-sm text-muted-foreground">{t("verifyIntro")}</p>
      <Label htmlFor={`${id}-code`}>{t("code")}</Label>
      <CodeInput
        id={`${id}-code`}
        value={code}
        onChange={setCode}
        onComplete={submit}
        disabled={verify.isPending}
        invalid={verify.isError}
        describedBy={verify.isError ? `${id}-error` : undefined}
      />
      {verify.isError && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {t(`errors.${authErrorKey(verify.error)}`)}
        </p>
      )}
      <Button type="submit" size="lg" className="h-11" disabled={verify.isPending || code.length !== 6}>
        {verify.isPending && <Loader2 className="animate-spin" aria-hidden />}
        {verify.isPending ? t("confirming") : t("confirm")}
      </Button>
      <Button type="button" variant="ghost" onClick={() => signOut.mutate()} disabled={signOut.isPending}>
        {t("useOtherAccount")}
      </Button>
    </form>
  );
}
