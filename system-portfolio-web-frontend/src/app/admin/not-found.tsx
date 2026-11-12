import { NotFoundState } from "@/components/admin/shared/NotFoundState";

// Qualquer endereço inexistente dentro de /admin
export default function AdminNotFound() {
  return (
    <main className="min-h-dvh bg-background">
      <NotFoundState href="/admin" />
    </main>
  );
}
