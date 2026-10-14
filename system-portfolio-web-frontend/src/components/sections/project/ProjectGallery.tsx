"use client";

import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER_SLOTS = 3;

type ProjectGalleryProps = {
  images: string[];
  title: string;
  slug: string;
};

// Moldura de janela de navegador em volta de cada captura
function BrowserFrame({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border px-4">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        </span>
        <span className="truncate font-mono text-[11px] text-muted-foreground">{label}</span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

// Galeria do case: primeira imagem em destaque + grade; clique abre ampliada.
// Sem imagens, mostra molduras vazias indicando onde as capturas vão entrar.
export function ProjectGallery({ images, title, slug }: ProjectGalleryProps) {
  const t = useTranslations("project");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  const hasImages = images.length > 0;
  const slots = hasImages ? images.length : PLACEHOLDER_SLOTS;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current !== null && !dialog.open) dialog.showModal();
    if (current === null && dialog.open) dialog.close();
  }, [current]);

  function step(direction: 1 | -1) {
    setCurrent((index) => (index === null ? null : (index + direction + images.length) % images.length));
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {Array.from({ length: slots }, (_, index) => {
          const featured = index === 0;
          const frameLabel = `${slug}.app${index === 0 ? "" : `/${index + 1}`}`;
          return (
            <BrowserFrame
              key={index}
              label={frameLabel}
              className={cn(featured && "md:col-span-2 md:row-span-2")}
            >
              {hasImages ? (
                <button
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={t("galleryOpen", { number: index + 1 })}
                  className={cn(
                    "group relative block w-full overflow-hidden",
                    featured ? "aspect-video md:aspect-auto md:h-full md:min-h-80" : "aspect-video",
                  )}
                >
                  <Image
                    src={images[index]}
                    alt={t("imageAlt", { number: index + 1, title })}
                    fill
                    sizes={featured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </button>
              ) : (
                <div
                  className={cn(
                    "bg-dots flex w-full flex-col items-center justify-center gap-2 text-muted-foreground",
                    featured ? "aspect-video md:aspect-auto md:h-full md:min-h-80" : "aspect-video",
                  )}
                >
                  <ImageIcon className="size-6 opacity-60" aria-hidden />
                  <span className="text-xs">{t("gallerySoon")}</span>
                </div>
              )}
            </BrowserFrame>
          );
        })}
      </div>

      {hasImages ? (
        <dialog
          ref={dialogRef}
          aria-label={t("gallery")}
          onClose={() => setCurrent(null)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
          onClick={(event) => {
            // Clique no fundo (fora da imagem) fecha
            if (event.target === event.currentTarget) setCurrent(null);
          }}
          className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
        >
          {current !== null ? (
            <div className="flex w-[min(92vw,1400px,calc((100dvh-9rem)*16/9))] flex-col gap-3">
              <div className="flex items-center justify-between text-white">
                <span className="font-mono text-xs text-white/70">
                  {t("galleryCount", { current: current + 1, total: images.length })}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrent(null)}
                  aria-label={t("galleryClose")}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
                <Image
                  src={images[current]}
                  alt={t("imageAlt", { number: current + 1, title })}
                  fill
                  sizes="92vw"
                  className="object-contain"
                />
              </div>

              {images.length > 1 ? (
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={t("galleryPrev")}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="size-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={t("galleryNext")}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <ChevronRight className="size-5" aria-hidden />
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </dialog>
      ) : null}
    </>
  );
}
