import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import messages from "../../../../messages/pt.json";

const t = messages.admin.home;

export const metadata: Metadata = { title: t.title };

// Início do admin. Provisório: a grade de sistemas entra na história 2
export default function AdminHomePage() {
  return <PageHeader title={t.title} description={t.subtitle} />;
}
