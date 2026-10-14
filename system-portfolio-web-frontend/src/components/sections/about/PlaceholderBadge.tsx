import { getTranslations } from "next-intl/server";

// Etiqueta para conteúdo de exemplo (some quando o item vira dado real)
export async function PlaceholderBadge() {
  const t = await getTranslations("about");
  return (
    <span
      title={t("placeholderHint")}
      className="inline-flex w-fit items-center rounded-full border border-dashed border-amber-400/60 px-2 py-0.5 font-mono text-[10px] tracking-wide text-amber-300 uppercase"
    >
      {t("placeholder")}
    </span>
  );
}
