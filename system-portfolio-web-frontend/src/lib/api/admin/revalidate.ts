import { adminAuth } from "./auth";

const SITE_REVALIDATION_ENABLED = false;

// Pede ao site que descarte o cache dos projetos depois de uma gravação (contracts/revalidacao.md).
// Devolve false se não deu (o site mostra a mudança quando o cache expirar sozinho).
export async function revalidatePublicSite(): Promise<boolean> {
  // Sem Supabase (implementação local em memória) não há o que invalidar
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return true;
  // CONTENÇÃO (2026-11-12): invalidar o cache faz o Cloudflare regenerar o início e a lista, e essa
  // regeneração trava o Worker. Pausado até a correção; as mudanças aparecem no próximo deploy.
  if (!SITE_REVALIDATION_ENABLED) return true;

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
