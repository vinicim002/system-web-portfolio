import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Cliente do Supabase só da área admin: guarda a sessão no navegador e renova o token.
// O site público e o formulário de contato usam `client.ts`, que não guarda sessão.
// Retorna null enquanto as variáveis de ambiente não estiverem configuradas.
export function getAdminSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || typeof window === "undefined") return null;

  client ??= createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: "vvn-admin-auth",
    },
  });
  return client;
}
