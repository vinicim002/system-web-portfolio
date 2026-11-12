import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { AdminBrand } from "@/components/admin/layout/AdminBrand";
import { AdminThemeToggle } from "@/components/admin/layout/AdminThemeToggle";
import messages from "../../../../../messages/pt.json";

const t = messages.admin.login;

export const metadata: Metadata = { title: t.title };

// Tela de login sem moldura do admin (grupo "auth")
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <AdminBrand label={messages.admin.shell.brand} />
          <AdminThemeToggle />
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.subtitle}</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
