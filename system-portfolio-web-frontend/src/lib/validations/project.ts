import { z } from "zod";

// Esquema do formulário de projeto do admin (specs/001-admin-telas/data-model.md).
// As mensagens são chaves de `admin.validation.*` em messages/pt.json.
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const MAX_TECH_STACK = 15;
export const MAX_GALLERY = 12;

const optionalText = (max: number) => z.string().max(max, "tooLong");

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || isHttpUrl(value), "invalidUrl");

export const projectDraftSchema = z.object({
  slug: z.string().trim().min(1, "required").regex(SLUG_PATTERN, "slugFormat"),
  title_pt: z.string().trim().min(1, "required").max(120, "tooLong"),
  title_en: z.string().trim().min(1, "required").max(120, "tooLong"),
  summary_pt: optionalText(300),
  summary_en: optionalText(300),
  content_pt: optionalText(20_000),
  content_en: optionalText(20_000),
  category: z.enum(["mobile", "web", "automation", ""]),
  status: z.enum(["production", "mvp", "in_progress", "proposal"]),
  tech_stack: z
    .array(z.string().trim().min(1, "required"))
    .max(MAX_TECH_STACK, "tooMany")
    .refine((items) => new Set(items.map((item) => item.toLowerCase())).size === items.length, "duplicate"),
  cover_url: z.string(),
  gallery_urls: z.array(z.string()).max(MAX_GALLERY, "tooMany"),
  repo_url: optionalUrl,
  demo_url: optionalUrl,
  featured: z.boolean(),
  published: z.boolean(),
  sort_order: z.number().int("integer").min(0, "minZero"),
});

export type ProjectDraftInput = z.infer<typeof projectDraftSchema>;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
