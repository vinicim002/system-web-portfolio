"use client";

import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { ImageRejection, usePreviewImages } from "@/hooks/admin/use-preview-images";
import { MAX_GALLERY } from "@/lib/validations/project";
import { ImageRejections } from "./ImageRejections";

type GalleryEditorProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  images: ReturnType<typeof usePreviewImages>;
  labelledBy: string;
};

// Galeria: adicionar várias (até 12), reordenar por botões e remover (RF-015)
export function GalleryEditor({ value, onChange, images, labelledBy }: GalleryEditorProps) {
  const t = useTranslations("admin.images");
  const inputRef = useRef<HTMLInputElement>(null);
  const [rejected, setRejected] = useState<ImageRejection[]>([]);
  const [overflow, setOverflow] = useState(0);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const free = MAX_GALLERY - value.length;
    const list = Array.from(files);
    const result = images.add(list.slice(0, Math.max(free, 0)), "gallery");
    setRejected(result.rejected);
    setOverflow(Math.max(list.length - Math.max(free, 0), 0));
    if (result.accepted.length > 0) onChange([...value, ...result.accepted.map((image) => image.url)]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(index: number, offset: -1 | 1) {
    const next = [...value];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    images.release(value[index]);
    onChange(value.filter((_, position) => position !== index));
    setOverflow(0);
  }

  return (
    <div className="flex flex-col gap-3">
      {value.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
          {t("galleryEmpty")}
        </p>
      ) : (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((url, index) => {
            const position = index + 1;
            return (
              <li key={url} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- blob: local não passa pelo next/image */}
                  <img src={url} alt={images.nameOf(url)} className="size-full object-cover" />
                  <span className="absolute top-1 left-1 rounded-md bg-background/85 px-1.5 text-xs font-medium">
                    {position}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{images.nameOf(url)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      aria-label={t("moveUp", { position })}
                      onClick={() => move(index, -1)}
                    >
                      <ChevronLeft aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === value.length - 1}
                      aria-label={t("moveDown", { position })}
                      onClick={() => move(index, 1)}
                    >
                      <ChevronRight aria-hidden />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    aria-label={t("removeAt", { position })}
                    onClick={() => remove(index)}
                  >
                    <X aria-hidden />
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-labelledby={labelledBy}
          onChange={(event) => handleFiles(event.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="px-3"
          disabled={value.length >= MAX_GALLERY}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus aria-hidden />
          {t("add")}
        </Button>
        <span className="text-xs text-muted-foreground">
          {t("galleryCount", { count: value.length, max: MAX_GALLERY })}
        </span>
      </div>
      <ImageRejections
        items={rejected}
        extra={overflow > 0 ? t("galleryFull", { max: MAX_GALLERY, count: overflow }) : undefined}
      />
    </div>
  );
}
