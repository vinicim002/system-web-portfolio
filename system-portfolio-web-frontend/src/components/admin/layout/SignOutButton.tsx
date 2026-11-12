"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/hooks/admin/use-admin-auth";
import { adminAuth } from "@/lib/api/admin/auth";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  // "icon": só o ícone (barra superior); "full": ícone + texto (gaveta do celular)
  variant?: "icon" | "full";
  className?: string;
};

// Sair do admin (RF-008): encerra a sessão, limpa o cache e volta ao login
export function SignOutButton({ variant = "icon", className }: SignOutButtonProps) {
  const t = useTranslations("admin.auth");
  const router = useRouter();
  const signOut = useSignOut();

  // Voltar pelo navegador depois de sair pode trazer a página do cache: recarrega se não há sessão
  useEffect(() => {
    const onPageShow = async (event: PageTransitionEvent) => {
      if (event.persisted && !(await adminAuth.getAccessToken())) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  function handleClick() {
    signOut.mutate(undefined, {
      onSettled: () => {
        toast.success(t("signedOut"));
        router.replace("/admin/login");
      },
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={variant === "icon" ? "icon-lg" : "lg"}
      className={cn(variant === "full" && "h-11 justify-start gap-3 px-3 text-muted-foreground", className)}
      aria-label={variant === "icon" ? t("signOut") : undefined}
      title={t("signOut")}
      disabled={signOut.isPending}
      onClick={handleClick}
    >
      <LogOut aria-hidden />
      {variant === "full" && t("signOut")}
    </Button>
  );
}
