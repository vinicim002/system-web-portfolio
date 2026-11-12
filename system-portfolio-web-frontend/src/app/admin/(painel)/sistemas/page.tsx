import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SystemsGrid } from "@/components/admin/systems/SystemsGrid";
import messages from "../../../../../messages/pt.json";

const t = messages.admin.systems;

export const metadata: Metadata = { title: t.title };

// Mesma grade do Início, sem os atalhos de projetos
export default function AdminSystemsPage() {
  return (
    <>
      <PageHeader title={t.title} description={t.subtitle} />
      <SystemsGrid />
    </>
  );
}
