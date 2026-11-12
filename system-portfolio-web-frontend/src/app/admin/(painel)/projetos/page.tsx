import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import messages from "../../../../../messages/pt.json";

const t = messages.admin.projects;

export const metadata: Metadata = { title: t.title };

// Provisório (história 1): só o título, para o menu já levar a algum lugar
export default function AdminProjectsPage() {
  return (
    <>
      <PageHeader title={t.title} description={t.subtitle} />
      <p className="text-sm text-muted-foreground">{messages.admin.common.comingInThisDelivery}</p>
    </>
  );
}
