"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type NotFoundStateProps = {
  title?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
};

// "Não encontrado" do admin, com atalho configurável de volta (RF-024)
export function NotFoundState({ title, description, href = "/admin", linkLabel }: NotFoundStateProps) {
  const t = useTranslations("admin.common");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-accent-text">
        <SearchX className="size-6" aria-hidden />
      </span>
      <h1 className="text-2xl font-bold tracking-tight">{title ?? t("notFound")}</h1>
      <p className="text-muted-foreground">{description ?? t("notFoundHint")}</p>
      <Button asChild size="lg" className="mt-2 px-4">
        <Link href={href}>{linkLabel ?? t("goHome")}</Link>
      </Button>
    </div>
  );
}
