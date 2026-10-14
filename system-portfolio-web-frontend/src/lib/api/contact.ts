import { getSupabaseClient } from "@/lib/supabase/client";
import type { ContactInput } from "@/lib/validations/contact";

export type ContactResult =
  | { status: "sent" }
  | { status: "not_configured" }
  | { status: "rate_limited" }
  | { status: "error" };

// Envia a mensagem pela Edge Function "contact" do Supabase, que valida e
// dispara o e-mail pelo Resend (a chave do Resend fica só no Supabase).
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { status: "not_configured" };

  const { error } = await supabase.functions.invoke("contact", { body: input });
  if (!error) return { status: "sent" };

  // FunctionsHttpError traz a resposta original com o status HTTP
  const response = (error as { context?: Response }).context;
  if (response?.status === 429) return { status: "rate_limited" };
  return { status: "error" };
}
