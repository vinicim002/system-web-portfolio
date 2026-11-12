"use client";

import { useTranslations } from "next-intl";
import { ProjectContent } from "@/components/sections/project/ProjectContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type MarkdownFieldProps = React.ComponentProps<typeof Textarea> & {
  id: string;
  value: string;
};

// Conteúdo em markdown com aba de pré-visualização igual à página do site (RF-016).
// Markdown malformado vira texto comum na pré-visualização, sem quebrar a tela.
export function MarkdownField({ id, value, ...textareaProps }: MarkdownFieldProps) {
  const t = useTranslations("admin.markdown");

  return (
    <Tabs defaultValue="write" className="gap-2">
      <TabsList>
        <TabsTrigger value="write">{t("write")}</TabsTrigger>
        <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
      </TabsList>
      <TabsContent value="write" forceMount className="flex flex-col gap-1.5 data-[state=inactive]:hidden">
        <Textarea id={id} className="min-h-56 font-mono text-sm" {...textareaProps} />
        <p className="text-xs text-muted-foreground">{t("hint")}</p>
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-56 rounded-lg border border-border bg-background px-4 py-2">
          {value.trim() ? (
            <ProjectContent content={value} />
          ) : (
            <p className="py-4 text-sm text-muted-foreground">{t("empty")}</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
