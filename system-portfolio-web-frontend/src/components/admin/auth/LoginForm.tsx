"use client";

import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Login só visual (RF-002, princípio VII): não valida, não guarda nada e só navega
export function LoginForm() {
  const t = useTranslations("admin.login");
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-email">{t("email")}</Label>
        <Input id="admin-email" name="email" type="email" placeholder={t("emailPlaceholder")} className="h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-password">{t("password")}</Label>
        <Input id="admin-password" name="password" type="password" autoComplete="off" className="h-11" />
      </div>
      <Button type="submit" size="lg" className="h-11">
        {t("submit")}
      </Button>
      <p className="flex gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
        {t("visualOnly")}
      </p>
    </form>
  );
}
