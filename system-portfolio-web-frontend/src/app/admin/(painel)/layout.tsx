import { Suspense } from "react";
import { AuthGate } from "@/components/admin/auth/AuthGate";
import { AdminShell } from "@/components/admin/layout/AdminShell";

// Moldura das telas do admin (tudo menos o login), só com acesso completo (senha + código)
export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* O guarda lê o endereço atual (usePathname/useSearchParams), que só existe na requisição */}
      <Suspense>
        <AuthGate>
          <AdminShell>{children}</AdminShell>
        </AuthGate>
      </Suspense>
    </>
  );
}
