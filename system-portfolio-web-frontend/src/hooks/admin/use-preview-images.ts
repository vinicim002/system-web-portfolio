"use client";

import { useCallback, useEffect, useRef } from "react";
import { isAcceptedImageType } from "@/lib/api/admin/storage-paths";
import { forgetImageName, imageNameOf, rememberImageName } from "@/lib/preview-image-names";
import { MAX_IMAGE_BYTES, type PreviewImage } from "@/types/admin";

export type ImageRejection = { name: string; reason: "notImage" | "unsupportedType" | "tooLarge" };

// Formatos que o Storage aceita (o mesmo filtro vai no "accept" dos campos de arquivo)
export const IMAGE_ACCEPT = "image/webp,image/png,image/jpeg,image/avif";

// Imagens escolhidas no formulário (envio simulado). As URLs blob: criadas aqui são
// liberadas ao remover a imagem ou ao sair do formulário, exceto as que foram salvas.
export function usePreviewImages() {
  const created = useRef(new Map<string, PreviewImage>());
  const kept = useRef(new Set<string>());

  useEffect(() => {
    const registry = created.current;
    const keep = kept.current;
    return () => {
      for (const url of registry.keys()) {
        if (keep.has(url)) continue;
        URL.revokeObjectURL(url);
        forgetImageName(url);
      }
      registry.clear();
    };
  }, []);

  // Valida tipo e tamanho (até 5 MB) e cria a pré-visualização local
  const add = useCallback((files: File[], kind: PreviewImage["kind"]) => {
    const accepted: PreviewImage[] = [];
    const rejected: ImageRejection[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        rejected.push({ name: file.name, reason: "notImage" });
      } else if (!isAcceptedImageType(file.type)) {
        rejected.push({ name: file.name, reason: "unsupportedType" });
      } else if (file.size > MAX_IMAGE_BYTES) {
        rejected.push({ name: file.name, reason: "tooLarge" });
      } else {
        const image = { url: URL.createObjectURL(file), name: file.name, size: file.size, kind };
        created.current.set(image.url, image);
        rememberImageName(image.url, file.name);
        accepted.push(image);
      }
    }
    return { accepted, rejected };
  }, []);

  const release = useCallback((url: string) => {
    if (created.current.has(url) && !kept.current.has(url)) {
      URL.revokeObjectURL(url);
      created.current.delete(url);
      forgetImageName(url);
    }
  }, []);

  // Depois de salvar, as imagens em uso continuam válidas para a lista e a reedição
  const keep = useCallback((urls: string[]) => {
    for (const url of urls) kept.current.add(url);
  }, []);

  // Nome para exibir: o do arquivo escolhido ou o fim do caminho já existente
  const nameOf = useCallback((url: string) => {
    return imageNameOf(url);
  }, []);

  return { add, release, keep, nameOf };
}
