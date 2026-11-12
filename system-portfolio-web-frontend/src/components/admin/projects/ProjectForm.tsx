"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FlaskConical, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, useForm, useWatch, type FieldError, type Resolver } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { GuardedLink } from "@/components/admin/shared/LeaveGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSaveProject, useSlugAvailability } from "@/hooks/admin/use-admin-projects";
import { usePreviewImages } from "@/hooks/admin/use-preview-images";
import { useUnsavedChanges } from "@/hooks/admin/use-unsaved-changes";
import { isAdminServiceError } from "@/lib/api/admin/errors";
import { slugify } from "@/lib/slugify";
import { projectDraftSchema, type ProjectDraftInput } from "@/lib/validations/project";
import type { ProjectDraft } from "@/types/admin";
import { GalleryEditor } from "./GalleryEditor";
import { ImagePicker } from "./ImagePicker";
import { MarkdownField } from "./MarkdownField";
import { TechStackInput } from "./TechStackInput";

const CATEGORIES = ["mobile", "web", "automation"] as const;
const STATUSES = ["production", "mvp", "in_progress", "proposal"] as const;
const NO_CATEGORY = "none";

type ValidationKey =
  | "required"
  | "tooLong"
  | "slugFormat"
  | "slugTaken"
  | "invalidUrl"
  | "duplicate"
  | "tooMany"
  | "integer"
  | "minZero";

type ProjectFormProps = {
  // Sem id: criação; com id: edição
  projectId?: string;
  initial: ProjectDraft;
  backHref: string;
  footerExtra?: React.ReactNode;
};

// Formulário completo do projeto (RF-011 a RF-014): validação junto de cada campo,
// slug sugerido pelo título, imagens e markdown com pré-visualização local
export function ProjectForm({ projectId, initial, backHref, footerExtra }: ProjectFormProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const images = usePreviewImages();
  const save = useSaveProject();
  const isSlugAvailable = useSlugAvailability();
  // Na edição o slug já existe; na criação ele segue o título até ser editado à mão
  const [slugTouched, setSlugTouched] = useState(Boolean(projectId) || initial.slug !== "");

  // Valida o esquema e, se o slug estiver no formato certo, confere se ele é único
  const resolver = useCallback<Resolver<ProjectDraftInput>>(
    async (values, context, options) => {
      const result = await zodResolver(projectDraftSchema)(values, context, options);
      if (result.errors.slug || !values.slug) return result;
      if (await isSlugAvailable(values.slug.trim(), projectId)) return result;
      return {
        values: {},
        errors: { ...result.errors, slug: { type: "slugTaken", message: "slugTaken" } },
      };
    },
    [isSlugAvailable, projectId],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useForm<ProjectDraftInput>({
    resolver,
    defaultValues: initial,
  });

  useUnsavedChanges(isDirty && !isSubmitting);

  const [slug, summaryPt, summaryEn, contentPt, contentEn] = useWatch({
    control,
    name: ["slug", "summary_pt", "summary_en", "content_pt", "content_en"],
  });

  function message(error: FieldError | undefined) {
    if (!error?.message) return undefined;
    return t(`validation.${error.message as ValidationKey}`);
  }

  async function checkSlug(value: string) {
    if (!value || errors.slug?.message === "slugFormat") return;
    const available = await isSlugAvailable(value.trim(), projectId);
    if (!available) setError("slug", { type: "slugTaken", message: "slugTaken" });
    else if (errors.slug?.message === "slugTaken") clearErrors("slug");
  }

  async function onSubmit(values: ProjectDraftInput) {
    try {
      const saved = await save.mutateAsync({ id: projectId, draft: values });
      images.keep([saved.cover_url ?? "", ...saved.gallery_urls].filter(Boolean));
      reset(values);
      toast.success(
        projectId
          ? t("projects.form.updated")
          : t("projects.form.created", {
              state: t(`projects.form.states.${saved.published ? "published" : "draft"}`),
            }),
      );
      router.push(backHref);
    } catch (error) {
      if (isAdminServiceError(error) && error.code === "slug_taken") {
        setError("slug", { type: "slugTaken", message: "slugTaken" }, { shouldFocus: true });
      } else if (isAdminServiceError(error) && error.code === "session_expired") {
        // O formulário fica como está; o guarda abre o aviso para entrar de novo
        toast.error(t("auth.errors.session_expired"));
      } else {
        toast.error(t("projects.form.saveError"));
      }
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, () => toast.error(t("projects.form.fixErrors")))}
      className="flex flex-col gap-6"
    >
      <Section title={t("projects.form.sections.identity")} hint={t("projects.form.sections.identityHint")}>
        <Field
          id="slug"
          label={t("projects.form.fields.slug")}
          hint={
            slug && !errors.slug
              ? t("projects.form.fields.slugPreview", { slug })
              : t("projects.form.fields.slugHint")
          }
          error={message(errors.slug)}
          required
        >
          <Input
            id="slug"
            className="h-10 font-mono"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={Boolean(errors.slug) || undefined}
            aria-describedby="slug-help"
            {...register("slug", {
              onChange: () => setSlugTouched(true),
              onBlur: (event) => checkSlug(event.target.value),
            })}
          />
          {!slugTouched && slug && (
            <p className="text-xs text-accent-text">{t("projects.form.fields.slugSuggested")}</p>
          )}
        </Field>
      </Section>

      <Section title={t("projects.form.sections.texts")} hint={t("projects.form.sections.textsHint")}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="title_pt" label={t("projects.form.fields.title_pt")} error={message(errors.title_pt)} required>
            <Input
              id="title_pt"
              className="h-10"
              aria-invalid={Boolean(errors.title_pt) || undefined}
              aria-describedby="title_pt-help"
              {...register("title_pt", {
                onChange: (event) => {
                  if (slugTouched) return;
                  setValue("slug", slugify(event.target.value), { shouldDirty: true, shouldValidate: isSubmitted });
                },
              })}
            />
          </Field>
          <Field id="title_en" label={t("projects.form.fields.title_en")} error={message(errors.title_en)} required>
            <Input
              id="title_en"
              className="h-10"
              aria-invalid={Boolean(errors.title_en) || undefined}
              aria-describedby="title_en-help"
              {...register("title_en")}
            />
          </Field>
          <Field
            id="summary_pt"
            label={t("projects.form.fields.summary_pt")}
            hint={t("projects.form.characters", { count: summaryPt.length, max: 300 })}
            error={message(errors.summary_pt)}
          >
            <Textarea
              id="summary_pt"
              rows={3}
              aria-invalid={Boolean(errors.summary_pt) || undefined}
              aria-describedby="summary_pt-help"
              {...register("summary_pt")}
            />
          </Field>
          <Field
            id="summary_en"
            label={t("projects.form.fields.summary_en")}
            hint={t("projects.form.characters", { count: summaryEn.length, max: 300 })}
            error={message(errors.summary_en)}
          >
            <Textarea
              id="summary_en"
              rows={3}
              aria-invalid={Boolean(errors.summary_en) || undefined}
              aria-describedby="summary_en-help"
              {...register("summary_en")}
            />
          </Field>
        </div>

        {(["content_pt", "content_en"] as const).map((name) => (
          <Field key={name} id={name} label={t(`projects.form.fields.${name}`)} error={message(errors[name])}>
            <MarkdownField
              id={name}
              value={name === "content_pt" ? contentPt : contentEn}
              aria-invalid={Boolean(errors[name]) || undefined}
              aria-describedby={`${name}-help`}
              {...register(name)}
            />
          </Field>
        ))}
      </Section>

      <Section title={t("projects.form.sections.classification")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="category" label={t("projects.form.fields.category")} error={message(errors.category)}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  value={field.value || NO_CATEGORY}
                  onValueChange={(value) => field.onChange(value === NO_CATEGORY ? "" : value)}
                >
                  <SelectTrigger id="category" className="h-10 w-full" onBlur={field.onBlur}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_CATEGORY}>{t("projects.form.fields.noCategory")}</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(`projects.labels.category.${category}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field id="status" label={t("projects.form.fields.status")} error={message(errors.status)} required>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" className="h-10 w-full" onBlur={field.onBlur}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`projects.labels.status.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
        <Field
          id="tech_stack"
          label={t("projects.form.fields.tech_stack")}
          hint={t("projects.form.fields.techStackHint")}
          error={message(errors.tech_stack as FieldError | undefined)}
        >
          <Controller
            control={control}
            name="tech_stack"
            render={({ field }) => (
              <TechStackInput
                id="tech_stack"
                value={field.value}
                onChange={field.onChange}
                invalid={Boolean(errors.tech_stack)}
                describedBy="tech_stack-help"
              />
            )}
          />
        </Field>
      </Section>

      <Section title={t("projects.form.sections.media")}>
        <p className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
          <FlaskConical className="size-3.5 shrink-0 text-accent-text" aria-hidden />
          {t("images.simulated")} {t("images.rules")}
        </p>
        <div className="flex flex-col gap-2">
          <p id="cover-label" className="text-sm font-medium">
            {t("projects.form.fields.cover")}
          </p>
          <Controller
            control={control}
            name="cover_url"
            render={({ field }) => (
              <ImagePicker value={field.value} onChange={field.onChange} images={images} labelledBy="cover-label" />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p id="gallery-label" className="text-sm font-medium">
            {t("projects.form.fields.gallery")}
          </p>
          <Controller
            control={control}
            name="gallery_urls"
            render={({ field }) => (
              <GalleryEditor value={field.value} onChange={field.onChange} images={images} labelledBy="gallery-label" />
            )}
          />
          {errors.gallery_urls && <p className="text-xs text-destructive">{message(errors.gallery_urls as FieldError)}</p>}
        </div>
      </Section>

      <Section title={t("projects.form.sections.links")}>
        <div className="grid gap-5 sm:grid-cols-2">
          {(["repo_url", "demo_url"] as const).map((name) => (
            <Field key={name} id={name} label={t(`projects.form.fields.${name}`)} error={message(errors[name])}>
              <Input
                id={name}
                type="url"
                inputMode="url"
                placeholder={t("projects.form.fields.urlPlaceholder")}
                className="h-10"
                aria-invalid={Boolean(errors[name]) || undefined}
                aria-describedby={`${name}-help`}
                {...register(name)}
              />
            </Field>
          ))}
        </div>
      </Section>

      <Section title={t("projects.form.sections.publication")}>
        <div className="grid gap-5 md:grid-cols-3">
          {(["published", "featured"] as const).map((name) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
                  <div>
                    <Label htmlFor={name}>{t(`projects.form.fields.${name}`)}</Label>
                    <p id={`${name}-hint`} className="mt-1 text-xs text-muted-foreground">
                      {t(`projects.form.fields.${name}Hint`)}
                    </p>
                  </div>
                  <Switch
                    id={name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    aria-describedby={`${name}-hint`}
                  />
                </div>
              )}
            />
          ))}
          <Field
            id="sort_order"
            label={t("projects.form.fields.sort_order")}
            hint={t("projects.form.fields.sortOrderHint")}
            error={message(errors.sort_order)}
          >
            <Input
              id="sort_order"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              className="h-10"
              aria-invalid={Boolean(errors.sort_order) || undefined}
              aria-describedby="sort_order-help"
              {...register("sort_order", { valueAsNumber: true })}
            />
          </Field>
        </div>
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div>{footerExtra}</div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="lg" className="px-4">
            <GuardedLink href={backHref}>{t("projects.form.cancel")}</GuardedLink>
          </Button>
          <Button type="submit" size="lg" className="px-4" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
            {isSubmitting ? t("projects.form.saving") : t("projects.form.save")}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

// Rótulo, campo, ajuda e erro; o erro aparece junto do campo (RF-012)
function Field({ id, label, hint, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        )}
      </Label>
      {children}
      <div id={`${id}-help`}>
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : (
          hint && <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}
