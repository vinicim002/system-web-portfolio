"use client";

import { Copy, Loader2, QrCode } from "lucide-react";
import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirmEnrollment, useStartEnrollment } from "@/hooks/admin/use-admin-auth";
import { authErrorKey } from "./auth-error";
import { CodeInput } from "./CodeInput";

type MfaEnrollProps = {
  // Chamado depois que o código confirma o novo fator
  onDone?: () => void;
  defaultName?: string;
};

// Cadastro de um aplicativo autenticador: nome → QR code (ou código manual) → código de 6 dígitos (RF-004)
export function MfaEnroll({ onDone, defaultName }: MfaEnrollProps) {
  const t = useTranslations("admin.auth");
  const id = useId();
  const start = useStartEnrollment();
  const confirm = useConfirmEnrollment();
  const [name, setName] = useState(defaultName ?? t("factorNamePlaceholder"));
  const [code, setCode] = useState("");
  const enrollment = start.data;

  function submitCode(value: string) {
    if (!enrollment || value.length !== 6 || confirm.isPending) return;
    confirm.mutate(
      { factorId: enrollment.factorId, code: value },
      {
        onSuccess: () => onDone?.(),
        onError: () => setCode(""),
      },
    );
  }

  async function copySecret() {
    if (!enrollment) return;
    try {
      await navigator.clipboard.writeText(enrollment.secret);
      toast.success(t("copied"));
    } catch {
      // Sem permissão de área de transferência: o código continua visível para copiar à mão
    }
  }

  if (!enrollment) {
    return (
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          start.mutate(name);
        }}
      >
        <p className="text-sm text-muted-foreground">{t("enrollIntro")}</p>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-name`}>{t("factorName")}</Label>
          <Input
            id={`${id}-name`}
            value={name}
            maxLength={40}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("factorNamePlaceholder")}
            className="h-11"
          />
        </div>
        {start.isError && (
          <p role="alert" className="text-sm text-destructive">
            {t(`errors.${authErrorKey(start.error)}`)}
          </p>
        )}
        <Button type="submit" size="lg" className="h-11" disabled={start.isPending}>
          {start.isPending ? <Loader2 className="animate-spin" aria-hidden /> : <QrCode aria-hidden />}
          {t("startEnroll")}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t("enrollIntro")}</p>
      <div className="flex justify-center rounded-2xl bg-white p-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- QR code em SVG gerado pelo Supabase (data URI) */}
        <img src={enrollment.qrCode} alt={t("qrAlt")} width={192} height={192} className="size-48" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">{t("manualCode")}</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs">{enrollment.secret}</code>
          <Button type="button" variant="outline" size="icon-lg" aria-label={t("copy")} onClick={copySecret}>
            <Copy aria-hidden />
          </Button>
        </div>
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          submitCode(code);
        }}
      >
        <Label htmlFor={`${id}-code`}>{t("enrollConfirm")}</Label>
        <CodeInput
          id={`${id}-code`}
          value={code}
          onChange={setCode}
          onComplete={submitCode}
          disabled={confirm.isPending}
          invalid={confirm.isError}
          describedBy={confirm.isError ? `${id}-error` : undefined}
        />
        {confirm.isError && (
          <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
            {t(`errors.${authErrorKey(confirm.error)}`)}
          </p>
        )}
        <Button type="submit" size="lg" className="h-11" disabled={confirm.isPending || code.length !== 6}>
          {confirm.isPending && <Loader2 className="animate-spin" aria-hidden />}
          {confirm.isPending ? t("confirming") : t("confirm")}
        </Button>
      </form>
    </div>
  );
}
