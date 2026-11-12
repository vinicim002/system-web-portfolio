import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminSupabase } from "@/lib/supabase/admin-client";
import type { AdminFactor, AuthStatus, FactorEnrollment } from "@/types/admin";
import { decideAuthStatus, uniqueFactorName } from "./auth-status";
import { AdminServiceError } from "./errors";

// Contrato do acesso ao admin (specs/002-admin-integracao/contracts/servicos.md)
export interface AdminAuthService {
  getStatus(): Promise<AuthStatus>;
  signIn(email: string, password: string): Promise<AuthStatus>;
  startEnrollment(friendlyName: string): Promise<FactorEnrollment>;
  confirmEnrollment(factorId: string, code: string): Promise<AuthStatus>;
  verifyCode(code: string): Promise<AuthStatus>;
  listFactors(): Promise<AdminFactor[]>;
  signOut(): Promise<void>;
  getAccessToken(): Promise<string | null>;
  onChange(callback: () => void): () => void;
}

type AuthErrorLike = { status?: number; code?: string; message?: string };

// Erros do Supabase Auth → códigos do admin (sem revelar qual dado está errado)
function toServiceError(error: AuthErrorLike, fallback: "invalid_credentials" | "invalid_code") {
  if (error.status === 429 || error.code === "over_request_rate_limit") {
    return new AdminServiceError("rate_limited");
  }
  return new AdminServiceError(fallback);
}

function requireClient(): SupabaseClient {
  const client = getAdminSupabase();
  if (!client) throw new AdminServiceError("invalid_credentials");
  return client;
}

async function verifiedTotpFactors(client: SupabaseClient) {
  const { data, error } = await client.auth.mfa.listFactors();
  if (error) throw error;
  return data.all.filter((factor) => factor.factor_type === "totp" && factor.status === "verified");
}

async function readStatus(client: SupabaseClient): Promise<AuthStatus> {
  const { data: sessionData } = await client.auth.getSession();
  if (!sessionData.session) return { step: "signed_out" };

  // admins_read_self: a conta só enxerga a própria linha
  const { data: adminRows, error: adminError } = await client.from("admins").select("user_id").limit(1);
  if (adminError) throw adminError;

  const [{ data: level }, factors] = await Promise.all([
    client.auth.mfa.getAuthenticatorAssuranceLevel(),
    verifiedTotpFactors(client),
  ]);

  return decideAuthStatus({
    hasSession: true,
    isAdmin: (adminRows ?? []).length > 0,
    currentLevel: level?.currentLevel ?? null,
    verifiedFactors: factors.length,
  });
}

export const adminAuth: AdminAuthService = {
  async getStatus() {
    const client = getAdminSupabase();
    if (!client) return { step: "signed_out" };
    return readStatus(client);
  },

  async signIn(email, password) {
    const client = requireClient();
    const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw toServiceError(error, "invalid_credentials");

    const status = await readStatus(client);
    // Conta que não é admin: encerra na hora (RF-002)
    if (status.step === "not_admin") await client.auth.signOut({ scope: "local" });
    return status;
  },

  async startEnrollment(friendlyName) {
    const client = requireClient();
    const { data, error } = await client.auth.mfa.listFactors();
    if (error) throw error;

    // Cadastro iniciado e não confirmado é descartado antes de começar outro
    const pending = data.all.filter((factor) => factor.factor_type === "totp" && factor.status === "unverified");
    for (const factor of pending) {
      await client.auth.mfa.unenroll({ factorId: factor.id });
    }

    const taken = data.all
      .filter((factor) => factor.status === "verified")
      .map((factor) => factor.friendly_name ?? "");
    const { data: enrolled, error: enrollError } = await client.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: uniqueFactorName(friendlyName, taken),
    });
    if (enrollError) throw toServiceError(enrollError, "invalid_code");

    return { factorId: enrolled.id, qrCode: enrolled.totp.qr_code, secret: enrolled.totp.secret };
  },

  async confirmEnrollment(factorId, code) {
    const client = requireClient();
    const { error } = await client.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    if (error) throw toServiceError(error, "invalid_code");
    return readStatus(client);
  },

  async verifyCode(code) {
    const client = requireClient();
    const [factor] = await verifiedTotpFactors(client);
    if (!factor) return readStatus(client);
    const { error } = await client.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() });
    if (error) throw toServiceError(error, "invalid_code");
    return readStatus(client);
  },

  async listFactors() {
    const client = requireClient();
    const factors = await verifiedTotpFactors(client);
    return factors.map((factor) => ({
      id: factor.id,
      friendlyName: factor.friendly_name ?? "",
      createdAt: factor.created_at,
    }));
  },

  async signOut() {
    const client = getAdminSupabase();
    if (client) await client.auth.signOut({ scope: "local" });
  },

  async getAccessToken() {
    const client = getAdminSupabase();
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session?.access_token ?? null;
  },

  onChange(callback) {
    const client = getAdminSupabase();
    if (!client) return () => {};
    // Não chamar o Supabase dentro do callback (o SDK avisa sobre travamento): só agenda
    const { data } = client.auth.onAuthStateChange(() => {
      setTimeout(callback, 0);
    });
    return () => data.subscription.unsubscribe();
  },
};
