import { isAdminServiceError } from "@/lib/api/admin/errors";

const KNOWN = ["invalid_credentials", "invalid_code", "rate_limited", "session_expired"] as const;

export type AuthErrorKey = (typeof KNOWN)[number] | "generic";

// Erro de qualquer operação de acesso → chave de admin.auth.errors.*
export function authErrorKey(error: unknown): AuthErrorKey {
  if (isAdminServiceError(error) && (KNOWN as readonly string[]).includes(error.code)) {
    return error.code as AuthErrorKey;
  }
  return "generic";
}
