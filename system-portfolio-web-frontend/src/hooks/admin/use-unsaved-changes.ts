"use client";

import { useEffect } from "react";
import { useLeaveGuard } from "@/components/admin/shared/LeaveGuard";

// Avisa ao sair com alterações não salvas: links do admin (diálogo) e recarregar/fechar a aba
export function useUnsavedChanges(isDirty: boolean) {
  const { setDirty } = useLeaveGuard();

  useEffect(() => {
    setDirty(isDirty);
    if (!isDirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      setDirty(false);
    };
  }, [isDirty, setDirty]);
}
