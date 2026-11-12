import { AdminShell } from "@/components/admin/layout/AdminShell";
import { AdminQueryProvider } from "@/components/admin/providers/AdminQueryProvider";
import { Toaster } from "@/components/ui/sonner";

// Moldura das telas do admin (tudo menos o login)
export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminQueryProvider>
      <AdminShell>{children}</AdminShell>
      <Toaster position="bottom-right" richColors={false} />
    </AdminQueryProvider>
  );
}
