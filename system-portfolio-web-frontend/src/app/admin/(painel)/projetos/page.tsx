import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProjectsList } from "@/components/admin/projects/ProjectsList";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import messages from "../../../../../messages/pt.json";

// Só aparece depois do login (AuthGate): fora da validação de navegação instantânea do Next
export const instant = false;

const t = messages.admin.projects;

export const metadata: Metadata = { title: t.title };

// Os filtros vêm da URL (useSearchParams); Suspense mantém a rota pré-renderizável
export default function AdminProjectsPage() {
  return (
    <>
      <PageHeader
        title={t.title}
        description={t.subtitle}
        actions={
          <Button asChild size="lg" className="px-4">
            <Link href="/admin/projetos/novo">
              <Plus aria-hidden />
              {t.new}
            </Link>
          </Button>
        }
      />
      <Suspense>
        <ProjectsList />
      </Suspense>
    </>
  );
}
