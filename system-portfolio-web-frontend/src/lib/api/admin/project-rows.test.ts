import { describe, expect, it } from "vitest";
import { emptyDraft } from "@/lib/project-draft";
import type { ProjectRow } from "@/types/project";
import { AdminServiceError } from "./errors";
import { draftToColumns, isUuid, matchesFilters, placeAt, sameOrder, swapOrder, toAdminError } from "./project-rows";

describe("draftToColumns", () => {
  it("textos vazios viram null e o resto é aparado", () => {
    const columns = draftToColumns({ ...emptyDraft(3), slug: " meu-slug ", title_pt: " Título ", title_en: "Title", repo_url: "  " });
    expect(columns).toMatchObject({ slug: "meu-slug", title_pt: "Título", summary_pt: null, repo_url: null, category: null, sort_order: 3 });
  });

  it("não compartilha listas com o rascunho", () => {
    const draft = { ...emptyDraft(), tech_stack: ["React"] };
    const columns = draftToColumns(draft);
    columns.tech_stack.push("Spring");
    expect(draft.tech_stack).toEqual(["React"]);
  });
});

describe("matchesFilters", () => {
  const row = { title_pt: "Telecarga Logística", title_en: "Telecarga Logistics", category: "web", status: "proposal" } as ProjectRow;

  it("busca sem acento e sem diferenciar maiúsculas", () => {
    expect(matchesFilters(row, { q: "LOGISTICA" })).toBe(true);
    expect(matchesFilters(row, { q: "rook" })).toBe(false);
  });

  it("combina categoria e status", () => {
    expect(matchesFilters(row, { category: "web", status: "proposal" })).toBe(true);
    expect(matchesFilters(row, { category: "web", status: "production" })).toBe(false);
  });
});

describe("ordem", () => {
  const ids = ["a", "b", "c", "d"];

  it("swapOrder troca com o vizinho e não mexe no topo/fim", () => {
    expect(swapOrder(ids, "b", "up")).toEqual(["b", "a", "c", "d"]);
    expect(swapOrder(ids, "a", "up")).toEqual(ids);
    expect(swapOrder(ids, "d", "down")).toEqual(ids);
  });

  it("swapOrder com id inexistente lança not_found", () => {
    expect(() => swapOrder(ids, "x", "up")).toThrow(AdminServiceError);
  });

  it("placeAt encaixa na posição e limita às pontas", () => {
    expect(placeAt(ids, "d", 1)).toEqual(["a", "d", "b", "c"]);
    expect(placeAt(ids, "a", 99)).toEqual(["b", "c", "d", "a"]);
    expect(placeAt(ids, "c", -5)).toEqual(["c", "a", "b", "d"]);
    expect(placeAt(["a", "b"], "novo", 1)).toEqual(["a", "novo", "b"]);
  });

  it("sameOrder compara posição a posição", () => {
    expect(sameOrder(ids, [...ids])).toBe(true);
    expect(sameOrder(ids, ["b", "a", "c", "d"])).toBe(false);
  });
});

describe("toAdminError", () => {
  it("slug repetido → slug_taken", () => {
    expect(toAdminError({ code: "23505" })).toMatchObject({ code: "slug_taken" });
  });

  it("token vencido ou sem permissão → session_expired", () => {
    expect(toAdminError({ code: "PGRST301" })).toMatchObject({ code: "session_expired" });
    expect(toAdminError({ message: "JWT expired" })).toMatchObject({ code: "session_expired" });
    expect(toAdminError({ code: "42501" })).toMatchObject({ code: "session_expired" });
  });

  it("outros erros viram erro genérico", () => {
    expect(toAdminError({ code: "XX000", message: "falhou" })).not.toBeInstanceOf(AdminServiceError);
  });
});

describe("isUuid", () => {
  it("aceita UUID e recusa slug", () => {
    expect(isUuid("3a8b0db2-21bb-4a64-8b75-a7b70c7620f3")).toBe(true);
    expect(isUuid("rookhub")).toBe(false);
  });
});
