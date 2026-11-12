// Nome original das imagens escolhidas no formulário (URL blob: ou URL já enviada → nome do arquivo).
// Vive em memória durante a sessão do navegador; serve às telas e às mensagens de erro de envio.
const names = new Map<string, string>();

export function rememberImageName(url: string, name: string) {
  names.set(url, name);
}

export function forgetImageName(url: string) {
  names.delete(url);
}

export function imageNameOf(url: string): string {
  return names.get(url) ?? decodeURIComponent(url.split("/").pop()?.split(/[?#]/)[0] ?? url);
}
