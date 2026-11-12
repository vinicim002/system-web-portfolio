// Regras puras das imagens no Storage (bucket project-images), testadas no Vitest

export const IMAGE_BUCKET = "project-images";
const PUBLIC_PREFIX = `/storage/v1/object/public/${IMAGE_BUCKET}/`;

// Tipos aceitos pelo bucket (allowed_mime_types da migration) e a extensão de cada um
export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/avif": "avif",
};

export function isAcceptedImageType(type: string): boolean {
  return type in IMAGE_EXTENSIONS;
}

// projects/<projectId>/<nome aleatório>.<ext> — nomes aleatórios nunca colidem entre projetos
export function buildObjectPath(projectId: string, type: string, randomName: string): string {
  const ext = IMAGE_EXTENSIONS[type];
  if (!ext) throw new Error(`tipo de imagem não aceito: ${type}`);
  return `projects/${projectId}/${randomName}.${ext}`;
}

export function projectFolder(projectId: string): string {
  return `projects/${projectId}`;
}

// URL pública do bucket → caminho do objeto; null para qualquer outra URL (ex.: /images/...)
export function objectPathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const index = url.indexOf(PUBLIC_PREFIX);
  if (index === -1) return null;
  const path = url.slice(index + PUBLIC_PREFIX.length).split(/[?#]/)[0];
  return path ? decodeURIComponent(path) : null;
}

export function imageUrlsOf(row: { cover_url: string | null; gallery_urls: string[] }): string[] {
  return [row.cover_url ?? "", ...row.gallery_urls].filter(Boolean);
}

// Objetos do bucket usados antes e não usados depois (as imagens antigas /images/... nunca entram)
export function orphanPaths(before: string[], after: string[]): string[] {
  const kept = new Set(after.map(objectPathFromUrl).filter((path): path is string => Boolean(path)));
  const orphans = new Set<string>();
  for (const url of before) {
    const path = objectPathFromUrl(url);
    if (path && !kept.has(path)) orphans.add(path);
  }
  return [...orphans];
}
