import type { SupabaseClient } from "@supabase/supabase-js";
import { rememberImageName } from "@/lib/preview-image-names";
import { MAX_IMAGE_BYTES } from "@/types/admin";
import { AdminServiceError } from "./errors";
import { toAdminError } from "./project-rows";
import { IMAGE_BUCKET, buildObjectPath, isAcceptedImageType, projectFolder } from "./storage-paths";

// Envio e limpeza das imagens dos projetos no Storage (spec 002, História 3).
// O RLS do bucket só aceita o admin com segundo fator (is_admin() com aal2).

export type UploadSession = {
  // Caminhos enviados neste salvamento (apagados se o salvamento falhar)
  uploaded: string[];
};

// Envia uma imagem escolhida no formulário (URL blob:) e devolve a URL pública
export async function uploadPreview(
  supabase: SupabaseClient,
  projectId: string,
  blobUrl: string,
  displayName: string,
  session: UploadSession,
): Promise<string> {
  let blob: Blob;
  try {
    blob = await (await fetch(blobUrl)).blob();
  } catch {
    throw new AdminServiceError("upload_failed", displayName);
  }
  if (!isAcceptedImageType(blob.type) || blob.size > MAX_IMAGE_BYTES) {
    throw new AdminServiceError("upload_failed", displayName);
  }

  const path = buildObjectPath(projectId, blob.type, crypto.randomUUID());
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, { contentType: blob.type, upsert: false, cacheControl: "31536000" });
  if (error) {
    const mapped = toAdminError(error);
    throw mapped instanceof AdminServiceError && mapped.code === "session_expired"
      ? mapped
      : new AdminServiceError("upload_failed", displayName);
  }
  session.uploaded.push(path);
  const publicUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  rememberImageName(publicUrl, displayName);
  return publicUrl;
}

// Apaga objetos do bucket; falha aqui não desfaz a gravação (fica só um arquivo sobrando)
export async function removeObjects(supabase: SupabaseClient, paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(paths);
  if (error) console.warn("Não foi possível apagar imagens do Storage", error.message);
}

// Apaga a pasta inteira do projeto (exclusão do projeto)
export async function removeProjectFolder(supabase: SupabaseClient, projectId: string): Promise<void> {
  const folder = projectFolder(projectId);
  const { data, error } = await supabase.storage.from(IMAGE_BUCKET).list(folder, { limit: 100 });
  if (error) {
    console.warn("Não foi possível listar as imagens do projeto", error.message);
    return;
  }
  await removeObjects(
    supabase,
    (data ?? []).map((item) => `${folder}/${item.name}`),
  );
}
