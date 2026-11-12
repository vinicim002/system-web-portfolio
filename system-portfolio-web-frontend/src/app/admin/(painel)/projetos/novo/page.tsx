import type { Metadata } from "next";
import { ProjectCreator } from "@/components/admin/projects/ProjectCreator";
import messages from "../../../../../../messages/pt.json";

export const metadata: Metadata = { title: messages.admin.projects.form.newTitle };

export default function AdminNewProjectPage() {
  return <ProjectCreator />;
}
