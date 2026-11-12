import { FolderKanban, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SystemsGrid } from "@/components/admin/systems/SystemsGrid";
import { Button } from "@/components/ui/button";
import messages from "../../../../messages/pt.json";

const t = messages.admin.home;

export const metadata: Metadata = { title: t.title };

// Início: central de sistemas + atalhos para a gestão de projetos (RF-006)
export default function AdminHomePage() {
  return (
    <>
      <PageHeader title={t.title} description={t.subtitle} />

      <section aria-labelledby="home-systems" className="flex flex-col gap-4">
        <h2 id="home-systems" className="text-lg font-bold">
          {t.systemsTitle}
        </h2>
        <SystemsGrid />
      </section>

      <section aria-labelledby="home-shortcuts" className="mt-10 flex flex-col gap-4">
        <h2 id="home-shortcuts" className="text-lg font-bold">
          {t.shortcutsTitle}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="lg" className="px-4">
            <Link href="/admin/projetos">
              <FolderKanban aria-hidden />
              {t.viewProjects}
            </Link>
          </Button>
          <Button asChild size="lg" className="px-4">
            <Link href="/admin/projetos/novo">
              <Plus aria-hidden />
              {t.newProject}
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
