import type { Metadata } from "next";
import { ProjectCreator } from "@/components/admin/projects/ProjectCreator";
import messages from "../../../../../../messages/pt.json";

// Só aparece depois do login (AuthGate): fora da validação de navegação instantânea do Next
export const instant = false;

export const metadata: Metadata = { title: messages.admin.projects.form.newTitle };

export default function AdminNewProjectPage() {
  return <ProjectCreator />;
}
