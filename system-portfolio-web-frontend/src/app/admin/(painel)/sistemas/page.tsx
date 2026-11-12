import type { Metadata } from "next";
import { SampleDataNotice } from "@/components/admin/layout/SampleDataNotice";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SystemsGrid } from "@/components/admin/systems/SystemsGrid";
import messages from "../../../../../messages/pt.json";

// Só aparece depois do login (AuthGate): fora da validação de navegação instantânea do Next
export const instant = false;

const t = messages.admin.systems;

export const metadata: Metadata = { title: t.title };

// Mesma grade do Início, sem os atalhos de projetos
export default function AdminSystemsPage() {
  return (
    <>
      <PageHeader title={t.title} description={t.subtitle} />
      <SampleDataNotice />
      <SystemsGrid />
    </>
  );
}
