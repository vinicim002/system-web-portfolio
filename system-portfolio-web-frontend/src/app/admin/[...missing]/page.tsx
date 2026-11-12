import { notFound } from "next/navigation";

// Captura rotas do admin que não existem e mostra o "não encontrado" do admin
export default function AdminMissingPage() {
  notFound();
}
