"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_TECH_STACK } from "@/lib/validations/project";

type TechStackInputProps = {
  id: string;
  value: string[];
  onChange: (items: string[]) => void;
  invalid?: boolean;
  describedBy?: string;
};

// Stack como lista de chips: Enter ou vírgula adiciona; repetidos são recusados
export function TechStackInput({ id, value, onChange, invalid, describedBy }: TechStackInputProps) {
  const t = useTranslations("admin.projects.form.fields");
  const [draft, setDraft] = useState("");
  const [duplicate, setDuplicate] = useState<string | null>(null);
  const full = value.length >= MAX_TECH_STACK;

  function commit() {
    const item = draft.trim().replace(/,$/, "").trim();
    if (!item) return;
    if (value.some((existing) => existing.toLowerCase() === item.toLowerCase())) {
      setDuplicate(item);
      return;
    }
    onChange([...value, item]);
    setDraft("");
    setDuplicate(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li key={item} className="flex items-center gap-1 rounded-lg bg-muted py-1 pr-1 pl-2.5 text-sm">
              {item}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={t("techStackRemove", { item })}
                onClick={() => onChange(value.filter((existing) => existing !== item))}
              >
                <X aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          disabled={full}
          placeholder={t("techStackPlaceholder")}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="h-10"
          onChange={(event) => {
            setDuplicate(null);
            setDraft(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commit();
            }
          }}
        />
        <Button type="button" variant="outline" size="lg" className="h-10 px-3" disabled={full} onClick={commit}>
          <Plus aria-hidden />
          {t("techStackAdd")}
        </Button>
      </div>
      {duplicate && (
        <p role="alert" className="text-xs text-destructive">
          {t("techStackDuplicate", { item: duplicate })}
        </p>
      )}
    </div>
  );
}
