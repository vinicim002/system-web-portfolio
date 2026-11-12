import { describe, expect, it } from "vitest";
import { mockProjects } from "@/lib/api/projects.mock";
import { emptyDraft, toDraft } from "@/lib/project-draft";
import { projectDraftSchema } from "./project";

const valid = { ...emptyDraft(), slug: "meu-projeto", title_pt: "Meu projeto", title_en: "My project" };

function errorsOf(input: unknown) {
  const result = projectDraftSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => `${issue.path.join(".")}:${issue.message}`);
}

describe("projectDraftSchema", () => {
  it("aceita os 5 projetos iniciais", () => {
    for (const row of mockProjects) {
      expect(errorsOf(toDraft(row)), row.slug).toEqual([]);
    }
  });

  it.each(["Meu-projeto", "meu projeto", "meu--projeto", "-meu", "meu-"])("recusa o slug %s", (slug) => {
    expect(errorsOf({ ...valid, slug })).toContain("slug:slugFormat");
  });

  it("recusa título vazio", () => {
    expect(errorsOf({ ...valid, title_pt: "  " })).toContain("title_pt:required");
  });

  it("recusa título acima de 120 caracteres", () => {
    expect(errorsOf({ ...valid, title_en: "a".repeat(121) })).toContain("title_en:tooLong");
  });

  it("recusa link sem http(s) e aceita vazio", () => {
    expect(errorsOf({ ...valid, repo_url: "github.com/x" })).toContain("repo_url:invalidUrl");
    expect(errorsOf({ ...valid, demo_url: "ftp://site.com" })).toContain("demo_url:invalidUrl");
    expect(errorsOf({ ...valid, repo_url: "", demo_url: "https://site.com" })).toEqual([]);
  });

  it("recusa stack com item repetido", () => {
    expect(errorsOf({ ...valid, tech_stack: ["React", "react"] })).toContain("tech_stack:duplicate");
  });

  it("recusa ordem negativa", () => {
    expect(errorsOf({ ...valid, sort_order: -1 })).toContain("sort_order:minZero");
  });
});
