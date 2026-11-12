export type AdminServiceErrorCode = "not_found" | "slug_taken";

// Erro dos serviços do admin; as telas traduzem o `code` (admin.errors.*)
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
