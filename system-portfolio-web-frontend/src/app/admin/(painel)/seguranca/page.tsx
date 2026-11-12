import type { Metadata } from "next";
import { SecurityPanel } from "@/components/admin/auth/SecurityPanel";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import messages from "../../../../../messages/pt.json";

// Só aparece depois do login (AuthGate): fora da validação de navegação instantânea do Next
export const instant = false;

const t = messages.admin.security;

export const metadata: Metadata = { title: t.title };

export default function AdminSecurityPage() {
  return (
    <>
      <PageHeader title={t.title} description={t.subtitle} />
      <SecurityPanel />
    </>
  );
}
