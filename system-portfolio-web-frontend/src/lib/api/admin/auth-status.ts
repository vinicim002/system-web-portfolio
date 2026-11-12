import type { AuthStatus } from "@/types/admin";

export type AuthFacts = {
  hasSession: boolean;
  isAdmin: boolean;
  currentLevel: string | null;
  verifiedFactors: number;
};

// Decide em que etapa do acesso o autor está (regra pura, testada no Vitest)
export function decideAuthStatus({ hasSession, isAdmin, currentLevel, verifiedFactors }: AuthFacts): AuthStatus {
  if (!hasSession) return { step: "signed_out" };
  if (!isAdmin) return { step: "not_admin" };
  if (verifiedFactors === 0) return { step: "enroll" };
  if (currentLevel !== "aal2") return { step: "verify" };
  return { step: "ready", factorCount: verifiedFactors };
}

// Nome amigável único por conta (o Supabase recusa nomes repetidos)
export function uniqueFactorName(base: string, taken: string[]): string {
  const name = base.trim() || "celular";
  if (!taken.includes(name)) return name;
  let index = 2;
  while (taken.includes(`${name} ${index}`)) index += 1;
  return `${name} ${index}`;
}

// Só aceita voltar para telas do próprio admin (evita redirecionar para fora)
export function safeReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.startsWith("/admin/login")) {
    return "/admin";
  }
  return value;
}
