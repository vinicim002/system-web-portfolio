"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
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

type LeaveGuardValue = {
  setDirty: (dirty: boolean) => void;
  // Devolve true quando a navegação foi barrada para pedir confirmação
  intercept: (href: string) => boolean;
};

const LeaveGuardContext = createContext<LeaveGuardValue | null>(null);

// Pergunta antes de sair de um formulário com alterações não salvas (RF-017).
// O App Router não permite bloquear navegações, então os links do admin passam por aqui.
export function LeaveGuardProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin.leave");
  const router = useRouter();
  const dirtyRef = useRef(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const setDirty = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  const intercept = useCallback((href: string) => {
    if (!dirtyRef.current) return false;
    setPendingHref(href);
    return true;
  }, []);

  const value = useMemo(() => ({ setDirty, intercept }), [setDirty, intercept]);

  function discard() {
    if (!pendingHref) return;
    dirtyRef.current = false;
    router.push(pendingHref);
    setPendingHref(null);
  }

  return (
    <LeaveGuardContext.Provider value={value}>
      {children}
      <AlertDialog open={pendingHref !== null} onOpenChange={(open) => !open && setPendingHref(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("stay")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={discard}>
              {t("discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LeaveGuardContext.Provider>
  );
}

export function useLeaveGuard(): LeaveGuardValue {
  const value = useContext(LeaveGuardContext);
  // Fora da moldura (ex.: login) não há o que proteger
  return value ?? { setDirty: () => {}, intercept: () => false };
}

type GuardedLinkProps = React.ComponentProps<typeof Link> & { href: string };

// Link interno que pede confirmação quando há alterações não salvas
export function GuardedLink({ href, onClick, ...props }: GuardedLinkProps) {
  const { intercept } = useLeaveGuard();

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);
        // Abrir em nova aba (Ctrl/Cmd/clique do meio) não sai da tela atual
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        if (intercept(href)) event.preventDefault();
      }}
      {...props}
    />
  );
}
