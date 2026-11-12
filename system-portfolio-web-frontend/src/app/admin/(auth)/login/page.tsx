import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginFlow } from "@/components/admin/auth/LoginFlow";
import { AdminBrand } from "@/components/admin/layout/AdminBrand";
import { AdminThemeToggle } from "@/components/admin/layout/AdminThemeToggle";
import messages from "../../../../../messages/pt.json";

export const metadata: Metadata = { title: messages.admin.login.title };

// Login do admin em etapas (senha, segundo fator), sem a moldura do painel
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <AdminBrand label={messages.admin.shell.brand} />
          <AdminThemeToggle />
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5 sm:p-8">
          {/* useSearchParams (?voltar=) só existe na requisição */}
          <Suspense>
            <LoginFlow />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
