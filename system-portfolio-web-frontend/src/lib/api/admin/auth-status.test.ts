import { describe, expect, it } from "vitest";
import { decideAuthStatus, safeReturnPath, uniqueFactorName } from "./auth-status";

const base = { hasSession: true, isAdmin: true, currentLevel: "aal1", verifiedFactors: 1 };

describe("decideAuthStatus", () => {
  it("sem sessão → signed_out", () => {
    expect(decideAuthStatus({ ...base, hasSession: false })).toEqual({ step: "signed_out" });
  });

  it("conta sem linha em admins → not_admin, mesmo com aal2", () => {
    expect(decideAuthStatus({ ...base, isAdmin: false, currentLevel: "aal2" })).toEqual({ step: "not_admin" });
  });

  it("admin sem fator verificado → enroll", () => {
    expect(decideAuthStatus({ ...base, verifiedFactors: 0 })).toEqual({ step: "enroll" });
  });

  it("admin com fator e aal1 → verify", () => {
    expect(decideAuthStatus(base)).toEqual({ step: "verify" });
  });

  it("admin com aal2 → ready com a contagem de fatores", () => {
    expect(decideAuthStatus({ ...base, currentLevel: "aal2", verifiedFactors: 2 })).toEqual({
      step: "ready",
      factorCount: 2,
    });
  });
});

describe("uniqueFactorName", () => {
  it("usa o nome pedido quando livre", () => {
    expect(uniqueFactorName("celular", [])).toBe("celular");
  });

  it("numera quando o nome já existe", () => {
    expect(uniqueFactorName("celular", ["celular", "celular 2"])).toBe("celular 3");
  });

  it("nome vazio vira 'celular'", () => {
    expect(uniqueFactorName("  ", [])).toBe("celular");
  });
});

describe("safeReturnPath", () => {
  it.each([
    ["/admin/projetos?q=rook", "/admin/projetos?q=rook"],
    ["/admin", "/admin"],
    [null, "/admin"],
    ["https://outro-site.com", "/admin"],
    ["//outro-site.com", "/admin"],
    ["/pt", "/admin"],
    ["/admin/login", "/admin"],
  ])("%s → %s", (input, expected) => {
    expect(safeReturnPath(input)).toBe(expected);
  });
});
