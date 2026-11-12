import { describe, expect, it } from "vitest";
import { buildObjectPath, imageUrlsOf, isAcceptedImageType, objectPathFromUrl, orphanPaths } from "./storage-paths";

const BASE = "https://exemplo.supabase.co/storage/v1/object/public/project-images";
const url = (path: string) => `${BASE}/${path}`;

describe("tipos e caminhos", () => {
  it("aceita só os 4 tipos do bucket", () => {
    expect(["image/webp", "image/png", "image/jpeg", "image/avif"].every(isAcceptedImageType)).toBe(true);
    expect(isAcceptedImageType("image/gif")).toBe(false);
    expect(isAcceptedImageType("image/svg+xml")).toBe(false);
  });

  it("monta projects/<id>/<nome>.<ext>", () => {
    expect(buildObjectPath("abc", "image/jpeg", "f1")).toBe("projects/abc/f1.jpg");
    expect(() => buildObjectPath("abc", "image/gif", "f1")).toThrow();
  });

  it("extrai o caminho só de URLs do bucket", () => {
    expect(objectPathFromUrl(url("projects/abc/f1.webp?v=2"))).toBe("projects/abc/f1.webp");
    expect(objectPathFromUrl("/images/projects/rookhub/login.webp")).toBeNull();
    expect(objectPathFromUrl("blob:http://localhost:3000/x")).toBeNull();
    expect(objectPathFromUrl(null)).toBeNull();
  });

  it("junta capa e galeria", () => {
    expect(imageUrlsOf({ cover_url: "a", gallery_urls: ["b", "c"] })).toEqual(["a", "b", "c"]);
    expect(imageUrlsOf({ cover_url: null, gallery_urls: [] })).toEqual([]);
  });
});

describe("orphanPaths", () => {
  it("lista o que saiu do projeto", () => {
    const before = [url("projects/p/capa.webp"), url("projects/p/g1.webp"), url("projects/p/g2.webp")];
    const after = [url("projects/p/nova-capa.webp"), url("projects/p/g2.webp")];
    expect(orphanPaths(before, after).sort()).toEqual(["projects/p/capa.webp", "projects/p/g1.webp"]);
  });

  it("imagens antigas /images/... nunca são órfãs", () => {
    expect(orphanPaths(["/images/projects/rookhub/login.webp"], [])).toEqual([]);
  });

  it("mudar a ordem ou repetir não gera órfã", () => {
    const a = url("projects/p/a.webp");
    const b = url("projects/p/b.webp");
    expect(orphanPaths([a, b, a], [b, a])).toEqual([]);
  });

  it("excluir tudo devolve cada caminho uma vez", () => {
    const a = url("projects/p/a.webp");
    expect(orphanPaths([a, a], [])).toEqual(["projects/p/a.webp"]);
  });
});
