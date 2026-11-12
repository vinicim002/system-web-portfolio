import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectEditor } from "@/components/admin/projects/ProjectEditor";
import messages from "../../../../../../messages/pt.json";

export const metadata: Metadata = { title: messages.admin.projects.form.editTitle };

// O id é lido no cliente (useParams); Suspense mantém a rota pré-renderizável
export default function AdminEditProjectPage() {
  return (
    <Suspense>
      <ProjectEditor />
    </Suspense>
  );
}
