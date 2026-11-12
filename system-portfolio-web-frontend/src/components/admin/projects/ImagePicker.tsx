"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { ImageRejection, usePreviewImages } from "@/hooks/admin/use-preview-images";
import { ImageRejections } from "./ImageRejections";

type ImagePickerProps = {
  value: string;
  onChange: (url: string) => void;
  images: ReturnType<typeof usePreviewImages>;
  labelledBy: string;
};

// Capa do projeto: escolher, ver e remover, sem enviar nada (RF-015)
export function ImagePicker({ value, onChange, images, labelledBy }: ImagePickerProps) {
  const t = useTranslations("admin.images");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rejected, setRejected] = useState<ImageRejection[]>([]);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const result = images.add([files[0]], "cover");
    setRejected(result.rejected);
    const [image] = result.accepted;
    if (image) {
      if (value) images.release(value);
      onChange(image.url);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove() {
    images.release(value);
    onChange("");
    setRejected([]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted sm:w-64">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob: local não passa pelo next/image
            <img src={value} alt={images.nameOf(value)} className="size-full object-cover" />
          ) : (
            <span className="px-4 text-center text-sm text-muted-foreground">{t("coverEmpty")}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-labelledby={labelledBy}
            onChange={(event) => handleFiles(event.target.files)}
          />
          <Button type="button" variant="outline" size="lg" className="px-3" onClick={() => inputRef.current?.click()}>
            <ImagePlus aria-hidden />
            {value ? t("change") : t("choose")}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="lg" className="px-3 text-destructive" onClick={remove}>
              <Trash2 aria-hidden />
              {t("remove")}
            </Button>
          )}
          {value && <p className="max-w-56 truncate text-xs text-muted-foreground">{images.nameOf(value)}</p>}
        </div>
      </div>
      <ImageRejections items={rejected} />
    </div>
  );
}
