export type AdminServiceErrorCode =
  | "not_found"
  | "slug_taken"
  | "invalid_credentials"
  | "invalid_code"
  | "rate_limited"
  | "not_admin"
  | "session_expired";

// Erro dos serviços do admin; as telas traduzem o `code` para uma mensagem em messages/pt.json
export class AdminServiceError extends Error {
  readonly code: AdminServiceErrorCode;

  constructor(code: AdminServiceErrorCode) {
    super(code);
    this.name = "AdminServiceError";
    this.code = code;
  }
}

export function isAdminServiceError(error: unknown): error is AdminServiceError {
  return error instanceof AdminServiceError;
}
