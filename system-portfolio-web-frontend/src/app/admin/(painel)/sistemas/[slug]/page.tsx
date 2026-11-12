import { Suspense } from "react";
import { SystemPlaceholder } from "@/components/admin/systems/SystemPlaceholder";

// Só aparece depois do login (AuthGate): fora da validação de navegação instantânea do Next
export const instant = false;

// O slug é lido no cliente (useParams); Suspense mantém a rota pré-renderizável
export default function AdminSystemPage() {
  return (
    <Suspense>
      <SystemPlaceholder />
    </Suspense>
  );
}
