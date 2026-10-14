import { getTranslations } from "next-intl/server";

export async function StudyingList() {
  const t = await getTranslations("about.studying");
  const items = t.raw("items") as string[];

  return (
    <section aria-labelledby="studying-title" className="flex flex-col gap-6">
      <header>
        <h2 id="studying-title" className="text-3xl tracking-tight lg:text-4xl">{t("title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* Borda tracejada para diferenciar visualmente do que já é experiência */}
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full border border-dashed border-muted-foreground/40 px-4 py-2 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
