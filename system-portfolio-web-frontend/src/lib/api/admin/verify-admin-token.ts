import { createClient } from "@supabase/supabase-js";

// Confere no Supabase, com o token do próprio usuário, se ele é admin com segundo fator (aal2).
// Usado só no servidor pela rota de invalidação do cache (contracts/revalidacao.md).
export async function isAdminToken(token: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}
