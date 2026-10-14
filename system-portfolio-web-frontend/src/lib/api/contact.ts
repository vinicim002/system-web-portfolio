import type { ContactInput } from "@/lib/validations/contact";

export type ContactResult = { status: "sent" } | { status: "not_configured" } | { status: "error" };

// TODO: definir o envio (EM ABERTO na spec): serviço de e-mail ou tabela no Supabase.
// Enquanto não houver backend, a função só informa que o envio não está ativo.
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  void input;
  return { status: "not_configured" };
}
