import { adminAuth } from "./auth";

// Pede ao site que descarte o cache dos projetos depois de uma gravação (contracts/revalidacao.md).
// Devolve false se não deu (o site mostra a mudança quando o cache expirar sozinho).
export async function revalidatePublicSite(): Promise<boolean> {
  // Sem Supabase (implementação local em memória) não há o que invalidar
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return true;

  const token = await adminAuth.getAccessToken();
  if (!token) return false;
  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}
