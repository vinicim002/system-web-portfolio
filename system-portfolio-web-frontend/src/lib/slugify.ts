// Gera um endereço curto compatível com ^[a-z0-9]+(-[a-z0-9]+)*$
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Compara textos sem diferenciar maiúsculas e acentos
export function normalizeSearch(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
