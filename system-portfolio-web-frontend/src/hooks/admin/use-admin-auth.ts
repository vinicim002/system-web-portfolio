"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { adminAuth } from "@/lib/api/admin/auth";
import type { AuthStatus } from "@/types/admin";

export const authKeys = {
  status: ["admin", "auth", "status"] as const,
  factors: ["admin", "auth", "factors"] as const,
};

// Etapa atual do acesso; acompanha login, logout e renovação da sessão
export function useAuthStatus() {
  const queryClient = useQueryClient();

  useEffect(
    () => adminAuth.onChange(() => queryClient.invalidateQueries({ queryKey: ["admin", "auth"] })),
    [queryClient],
  );

  return useQuery({
    queryKey: authKeys.status,
    queryFn: () => adminAuth.getStatus(),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

function useStatusMutation<T>(mutationFn: (input: T) => Promise<AuthStatus>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (status) => {
      queryClient.setQueryData(authKeys.status, status);
      return queryClient.invalidateQueries({ queryKey: authKeys.factors });
    },
  });
}

// Conta sem acesso: a sessão já foi encerrada pelo serviço; o resultado fica só no formulário
// (mudar o estado geral recriaria o formulário e apagaria o aviso de acesso negado)
export function useSignIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => adminAuth.signIn(email, password),
    onSuccess: (status) => {
      if (status.step === "not_admin") return;
      queryClient.setQueryData(authKeys.status, status);
      return queryClient.invalidateQueries({ queryKey: authKeys.factors });
    },
  });
}

export function useVerifyCode() {
  return useStatusMutation((code: string) => adminAuth.verifyCode(code));
}

export function useConfirmEnrollment() {
  return useStatusMutation(({ factorId, code }: { factorId: string; code: string }) =>
    adminAuth.confirmEnrollment(factorId, code),
  );
}

export function useStartEnrollment() {
  return useMutation({ mutationFn: (friendlyName: string) => adminAuth.startEnrollment(friendlyName) });
}

// Sair: encerra a sessão e apaga tudo o que estava em cache (inclusive rascunhos)
export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminAuth.signOut(),
    onSettled: () => {
      queryClient.clear();
      queryClient.setQueryData(authKeys.status, { step: "signed_out" } satisfies AuthStatus);
    },
  });
}

export function useFactors() {
  return useQuery({ queryKey: authKeys.factors, queryFn: () => adminAuth.listFactors() });
}
