import { beforeEach, describe, expect, it } from "vitest";
import { emptyDraft, toDraft } from "@/lib/project-draft";
import { AdminServiceError } from "./errors";
import type { AdminProjectsService } from "./projects";
import { createLocalAdminProjects } from "./projects.local";

let service: AdminProjectsService;

beforeEach(() => {
  service = createLocalAdminProjects({ delayMs: 0 });
});

function orders(rows: { sort_order: number }[]) {
  return rows.map((row) => row.sort_order);
}

describe("serviço local de projetos", () => {
  it("começa com os 5 projetos do site, com ordem contínua", async () => {
    const rows = await service.list();
    expect(rows).toHaveLength(5);
    expect(orders(rows)).toEqual([0, 1, 2, 3, 4]);
  });

  it("busca sem diferenciar maiúsculas e acentos", async () => {
    const rows = await service.list({ q: "LOGISTICA" });
    expect(rows.map((row) => row.title_pt)).toEqual(["Telecarga Logística"]);
  });

  it("combina filtros de categoria e status", async () => {
    const rows = await service.list({ category: "web", status: "production" });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.category === "web" && row.status === "production")).toBe(true);
  });

  it("cria projeto como rascunho e com textos vazios como null", async () => {
    const created = await service.create({
      ...emptyDraft(5),
      slug: "novo-projeto",
      title_pt: "Novo projeto",
      title_en: "New project",
    });
    expect(created.id).toBeTruthy();
    expect(created.published).toBe(false);
    expect(created.summary_pt).toBeNull();
    expect(created.sort_order).toBe(5);
    expect(await service.list()).toHaveLength(6);
  });

  it("recusa slug repetido ao criar", async () => {
    const attempt = service.create({ ...emptyDraft(), slug: "rookhub", title_pt: "X", title_en: "X" });
    await expect(attempt).rejects.toBeInstanceOf(AdminServiceError);
    await expect(attempt).rejects.toMatchObject({ code: "slug_taken" });
  });

  it("editar muda updated_at e mantém o próprio slug", async () => {
    const [first] = await service.list();
    const updated = await service.update(first.id, { ...toDraft(first), title_pt: "Editado" });
    expect(updated.title_pt).toBe("Editado");
    expect(updated.updated_at).not.toBe(first.updated_at);
  });

  it("editar um id inexistente lança not_found", async () => {
    await expect(service.update("nao-existe", emptyDraft())).rejects.toMatchObject({ code: "not_found" });
  });

  it("excluir renumera a ordem sem repetir", async () => {
    const [, second] = await service.list();
    await service.remove(second.id);
    const rows = await service.list();
    expect(rows).toHaveLength(4);
    expect(orders(rows)).toEqual([0, 1, 2, 3]);
    expect(await service.get(second.id)).toBeNull();
  });

  it("mover para cima o primeiro item não muda nada", async () => {
    const before = await service.list();
    const after = await service.move(before[0].id, "up");
    expect(after.map((row) => row.id)).toEqual(before.map((row) => row.id));
  });

  it("mover para baixo troca com o vizinho", async () => {
    const before = await service.list();
    const after = await service.move(before[0].id, "down");
    expect(after[0].id).toBe(before[1].id);
    expect(after[1].id).toBe(before[0].id);
    expect(orders(after)).toEqual([0, 1, 2, 3, 4]);
  });

  it("publicar e destacar alteram só o item certo", async () => {
    const [first, second] = await service.list();
    await service.setPublished(first.id, false);
    await service.setFeatured(first.id, false);
    const rows = await service.list();
    expect(rows[0]).toMatchObject({ published: false, featured: false });
    expect(rows[1]).toMatchObject({ published: second.published, featured: second.featured });
  });

  it("alterar o retorno não muda o estado interno", async () => {
    const [first] = await service.list();
    first.title_pt = "mutado";
    const [again] = await service.list();
    expect(again.title_pt).not.toBe("mutado");
  });
});
