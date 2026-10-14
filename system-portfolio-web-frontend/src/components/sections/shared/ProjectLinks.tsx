import { Rocket } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectLinksProps = {
  demoUrl: string | null;
  repoUrl: string | null;
  labels: { deploy: string; github: string; soon: string };
  // sm: pílulas (cards e arquivo) | lg: botões (página do case)
  size?: "sm" | "lg";
  // inverted: sobre fundos coloridos com texto branco (tiras do arquivo)
  tone?: "default" | "inverted";
  className?: string;
};

type LinkItem = {
  key: "deploy" | "github";
  href: string | null;
  label: string;
  icon: React.ReactNode;
};

// Botões de Deploy e GitHub de um projeto; sem link, aparecem desativados
export function ProjectLinks({
  demoUrl,
  repoUrl,
  labels,
  size = "sm",
  tone = "default",
  className,
}: ProjectLinksProps) {
  const iconSize = size === "lg" ? "size-4" : "size-3.5";
  const items: LinkItem[] = [
    { key: "deploy", href: demoUrl, label: labels.deploy, icon: <Rocket className={iconSize} aria-hidden /> },
    { key: "github", href: repoUrl, label: labels.github, icon: <GithubIcon className={iconSize} /> },
  ];

  function classesFor(key: LinkItem["key"], enabled: boolean) {
    if (size === "lg") {
      return cn(
        buttonVariants({ variant: key === "deploy" ? "default" : "outline", size: "lg" }),
        "h-11 px-5",
        !enabled && "pointer-events-auto cursor-not-allowed opacity-50",
      );
    }
    return cn(
      "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium backdrop-blur-sm transition-colors",
      tone === "inverted"
        ? "border-white/30 bg-white/10 text-white"
        : "border-border bg-background/70",
      enabled
        ? tone === "inverted"
          ? "hover:bg-white/20"
          : "hover:border-secondary hover:text-accent-text"
        : tone === "inverted"
          ? "cursor-not-allowed text-white/50"
          : "cursor-not-allowed text-muted-foreground/60",
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map(({ key, href, label, icon }) =>
        href ? (
          <a key={key} href={href} target="_blank" rel="noreferrer" className={classesFor(key, true)}>
            {icon}
            {label}
          </a>
        ) : (
          <span
            key={key}
            role="link"
            aria-disabled="true"
            title={labels.soon}
            className={classesFor(key, false)}
          >
            {icon}
            {label}
          </span>
        ),
      )}
    </div>
  );
}
