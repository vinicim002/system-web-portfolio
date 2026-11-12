import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectEditor } from "@/components/admin/projects/ProjectEditor";
import messages from "../../../../../../messages/pt.json";

// Só aparece depois do login (AuthGate): fora da validação de navegação instantânea do Next
export const instant = false;

export const metadata: Metadata = { title: messages.admin.projects.form.editTitle };

// O id é lido no cliente (useParams); Suspense mantém a rota pré-renderizável
export default function AdminEditProjectPage() {
  return (
    <Suspense>
      <ProjectEditor />
    </Suspense>
  );
}
