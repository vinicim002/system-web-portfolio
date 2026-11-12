import { Suspense } from "react";
import { SystemPlaceholder } from "@/components/admin/systems/SystemPlaceholder";

// O slug é lido no cliente (useParams); Suspense mantém a rota pré-renderizável
export default function AdminSystemPage() {
  return (
    <Suspense>
      <SystemPlaceholder />
    </Suspense>
  );
}
