"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Info, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage, type ContactResult } from "@/lib/api/contact";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

const fieldClass = "h-12 rounded-xl border-border bg-background/60 px-4 dark:bg-background/60";

export function ContactForm() {
  const t = useTranslations("contact");
  const [result, setResult] = useState<ContactResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  async function onSubmit(values: ContactInput) {
    setResult(null);
    try {
      const response = await sendContactMessage(values);
      setResult(response);
      if (response.status === "sent") reset();
    } catch {
      setResult({ status: "error" });
    }
  }

  function errorFor(field: keyof ContactInput) {
    const message = errors[field]?.message;
    if (!message) return null;
    return (
      <p id={`${field}-error`} className="text-xs text-destructive">
        {t(`validation.${message as "name" | "email" | "message"}`)}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t("form.name")}</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder={t("form.namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass}
            {...register("name")}
          />
          {errorFor("name")}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("form.email")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("form.emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass}
            {...register("email")}
          />
          {errorFor("email")}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">{t("form.message")}</Label>
        <Textarea
          id="message"
          rows={7}
          placeholder={t("form.messagePlaceholder")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(fieldClass, "h-auto min-h-40 resize-y py-3")}
          {...register("message")}
        />
        {errorFor("message")}
      </div>

      {/* Campo-armadilha contra robôs: fora da tela e fora da navegação */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full text-sm">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            {t("form.sending")}
          </>
        ) : (
          <>
            {t("form.submit")}
            <Send aria-hidden />
          </>
        )}
      </Button>

      <div role="status" aria-live="polite">
        {result ? (
          <p
            className={cn(
              "flex items-start gap-3 rounded-xl p-4 text-sm",
              result.status === "sent" ? "bg-muted text-foreground" : "bg-muted text-muted-foreground",
              result.status === "error" && "text-destructive",
            )}
          >
            {result.status === "sent" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
            ) : (
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            )}
            {result.status === "sent"
              ? t("form.success")
              : result.status === "not_configured"
                ? t("form.notConfigured")
                : result.status === "rate_limited"
                  ? t("form.rateLimited")
                  : t("form.error")}
          </p>
        ) : null}
      </div>
    </form>
  );
}
