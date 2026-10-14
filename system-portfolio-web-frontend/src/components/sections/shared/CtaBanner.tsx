import { ArrowRight } from "lucide-react";
import { CardWaves } from "@/components/effects/CardWaves";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CtaBannerProps = {
  title: string;
  button: string;
  // Fundo animado igual ao dos cards da home (versão em destaque)
  waves?: boolean;
};

// Chamada final para a página de contato
export function CtaBanner({ title, button, waves = false }: CtaBannerProps) {
  return (
    <section
      className={cn(
        "relative isolate flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center lg:p-12",
        waves && "min-h-70 sm:items-end lg:min-h-85 lg:p-14",
      )}
    >
      {waves ? <CardWaves /> : null}

      <div className="flex flex-col gap-3">
        {waves ? <p className="font-mono text-xs text-muted-foreground">{siteConfig.domain}</p> : null}
        <h2
          className={cn(
            "tracking-tight",
            waves ? "max-w-3xl text-4xl leading-[1.05] tracking-tighter sm:text-5xl lg:text-7xl" : "text-2xl lg:text-4xl",
          )}
        >
          {title}
        </h2>
      </div>

      <Button asChild size="lg" className={cn("h-11 shrink-0 px-5", waves && "h-12 px-6 text-sm")}>
        <Link href="/contato">
          {button}
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    </section>
  );
}
