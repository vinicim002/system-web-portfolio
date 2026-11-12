"use client";

import { useTranslations } from "next-intl";
import type { ImageRejection } from "@/hooks/admin/use-preview-images";

// Motivo de cada arquivo recusado (não é imagem ou passa de 5 MB)
export function ImageRejections({ items, extra }: { items: ImageRejection[]; extra?: string }) {
  const t = useTranslations("admin.images");
  if (items.length === 0 && !extra) return null;

  return (
    <ul role="alert" className="flex flex-col gap-1 text-xs text-destructive">
      {items.map((item) => (
        <li key={`${item.name}-${item.reason}`}>{t(item.reason, { name: item.name })}</li>
      ))}
      {extra && <li>{extra}</li>}
    </ul>
  );
}
