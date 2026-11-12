export type AdminServiceErrorCode =
  | "not_found"
  | "slug_taken"
  | "invalid_credentials"
  | "invalid_code"
  | "rate_limited"
  | "not_admin"
  | "session_expired"
  | "upload_failed";

// Erro dos serviços do admin; as telas traduzem o `code` para uma mensagem em messages/pt.json
export class AdminServiceError extends Error {
  readonly code: AdminServiceErrorCode;
  // Informação extra para a mensagem (ex.: nome da imagem que falhou no envio)
  readonly detail?: string;

  constructor(code: AdminServiceErrorCode, detail?: string) {
    super(code);
    this.name = "AdminServiceError";
    this.code = code;
    this.detail = detail;
  }
}

export function isAdminServiceError(error: unknown): error is AdminServiceError {
  return error instanceof AdminServiceError;
}
