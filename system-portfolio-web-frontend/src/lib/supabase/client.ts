import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Cliente do Supabase para o navegador (só chaves públicas).
// Retorna null enquanto as variáveis de ambiente não estiverem configuradas.
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  client ??= createClient(url, anonKey, { auth: { persistSession: false } });
  return client;
}
